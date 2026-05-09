import json
from typing import Any

import requests

from app.config import settings

NCR_CITY_NAMES = [
    "Manila",
    "Quezon City",
    "Caloocan",
    "Las Pinas",
    "Las Piñas",
    "Makati",
    "Malabon",
    "Mandaluyong",
    "Marikina",
    "Muntinlupa",
    "Navotas",
    "Paranaque",
    "Parañaque",
    "Pasay",
    "Pasig",
    "San Juan",
    "Taguig",
    "Valenzuela",
]

BANTAI_SYSTEM_PROMPT = (
    "You are BantAI, the Bantay Bayan AI Risk Assistant. You only answer questions related to LGU risk analysis, "
    "procurement exposure, audit findings, governance insights, rankings, simulations, and information shown within "
    "the Bantay Bayan platform. Politely refuse unrelated questions."
)
BANTAI_SCOPE_REFUSAL = "I'm BantAI, and I can only answer questions related to Bantay Bayan and its governance analytics."
BANTAI_SCOPE_KEYWORDS = {
    "audit",
    "auditor",
    "bantay",
    "bayan",
    "budget",
    "city",
    "coa",
    "compare",
    "completion",
    "corruption",
    "exposure",
    "escalate",
    "evidence",
    "factor",
    "finding",
    "governance",
    "government",
    "insight",
    "lgu",
    "municipality",
    "procurement",
    "ranking",
    "record",
    "review",
    "risk",
    "score",
    "simulation",
    "supplier",
}


class LLMService:
    """
    Wrapper for external LLM calls to generate risk explanations.
    Supports OpenAI-compatible chat completions, Ollama, and simple prompt APIs.
    """

    def __init__(self, api_url: str | None = None, api_key: str | None = None, model: str | None = None):
        self.api_url = (api_url or settings.llm_api_url or "").strip()
        self.api_key = (api_key or settings.llm_api_key or "").strip()
        self.model = (model or settings.llm_model or "llama3.2:3b").strip()

    @property
    def configured(self) -> bool:
        return bool(self.api_url)

    def build_explanation_prompt(self, lgu_name: str, risk_score: float, risk_level: str, factors: dict) -> str:
        factors_json = json.dumps(factors or {}, ensure_ascii=False, indent=2)
        return f"""You are a risk analysis expert for Local Government Units (LGUs) in the Philippines.
Based on the following LGU risk profile, provide a concise 2-3 sentence explanation of the risk level and key contributing factors.
Keep the tone factual, cautious, and useful for reviewers. Do not claim proven corruption; describe risk indicators and recommended follow-up.

LGU Name: {lgu_name}
Risk Score: {risk_score}/100
Risk Level: {risk_level.upper()}
Contributing Factors:
{factors_json}

Provide a clear, actionable explanation suitable for government officials."""

    def build_fallback_explanation(self, lgu_name: str, risk_score: float, risk_level: str, factors: dict | None) -> str:
        factors = factors or {}
        readable_factors = [
            f"{key.replace('_', ' ')}: {value}"
            for key, value in factors.items()
            if value not in (None, "", [], {})
        ]
        factor_text = "; ".join(readable_factors[:4])

        if factor_text:
            return (
                f"{lgu_name} is currently assessed as {risk_level} risk with a score of {risk_score:.1f}/100. "
                f"The main indicators are {factor_text}. Review the supporting procurement and audit records before taking action."
            )

        return (
            f"{lgu_name} is currently assessed as {risk_level} risk with a score of {risk_score:.1f}/100. "
            "Review the scoring factors, procurement history, and audit findings to identify the records driving this result."
        )

    def build_question_prompt(
        self,
        lgu_name: str,
        risk_score: float,
        risk_level: str,
        factors: dict,
        question: str,
    ) -> str:
        factors_json = json.dumps(factors or {}, ensure_ascii=False, indent=2)
        return f"""{BANTAI_SYSTEM_PROMPT}

You are helping a government reviewer understand an LGU risk assessment.
Answer the user's question using only the risk profile below. If the data is not enough, say what additional records should be checked.
Keep the answer practical, concise, and evidence-aware. Do not claim proven corruption.
If the user only greets you, greet them back and invite a risk-review question.
If the question asks about a different LGU than the profile below, explain that the reviewer must select that LGU first.
If the question assumes this LGU is the highest risk but the score/risk level does not support that, correct the assumption.
If the LGU is Low risk, describe the items as monitoring points rather than major red flags.

LGU Name: {lgu_name}
Risk Score: {risk_score}/100
Risk Level: {risk_level.upper()}
Contributing Factors:
{factors_json}

Reviewer Question: {question}

Answer:"""

    def is_bantay_related_question(self, question: str) -> bool:
        normalized_question = question.lower().strip()
        if not normalized_question:
            return True

        simple_greetings = {"hello", "hi", "hey", "good morning", "good afternoon", "good evening"}
        if normalized_question.strip(" .!?") in simple_greetings:
            return True

        return any(keyword in normalized_question for keyword in BANTAI_SCOPE_KEYWORDS)

    def build_fallback_answer(
        self,
        lgu_name: str,
        risk_score: float,
        risk_level: str,
        factors: dict | None,
        question: str,
    ) -> str:
        normalized_question = question.lower()
        normalized_lgu = lgu_name.lower()
        simple_greetings = {"hello", "hi", "hey", "good morning", "good afternoon", "good evening"}
        factors = factors or {}
        readable_factors = [
            f"{key.replace('_', ' ')}: {value}"
            for key, value in factors.items()
            if value not in (None, "", [], {})
        ]
        top_factors = "; ".join(readable_factors[:5]) or "the available score and risk level"
        selected_context = f"This answer is based on the selected profile: {lgu_name}."

        if normalized_question.strip(" .!?") in simple_greetings:
            return (
                f"Hello. I can help review the selected LGU profile for {lgu_name}. "
                "Ask about the risk score, contributing factors, audit finding, procurement pattern, or recommended next check."
            )

        mentioned_other_lgus = [
            city
            for city in NCR_CITY_NAMES
            if city.lower() in normalized_question and city.lower() not in normalized_lgu
        ]
        if mentioned_other_lgus:
            return (
                f"{selected_context} Your question mentions {mentioned_other_lgus[0]}, but that LGU is not the active profile in this panel. "
                f"Select {mentioned_other_lgus[0]} in the ranking or audit table to get an evidence-based answer for that city."
            )

        if any(term in normalized_question for term in ("highest", "top", "most risky", "rank")):
            if risk_score < 75:
                return (
                    f"{selected_context} {lgu_name} is not currently a high-risk LGU in this profile; it is rated {risk_level} at {risk_score:.1f}/100. "
                    f"The visible drivers are {top_factors}, so compare it against the ranking table before treating it as a top risk case."
                )
            return (
                f"{selected_context} {lgu_name} appears high in the ranking because its score is {risk_score:.1f}/100 and the main visible drivers are {top_factors}. "
                "Review those factors against the source records before deciding whether escalation is warranted."
            )

        if "next" in normalized_question or "recommend" in normalized_question or "action" in normalized_question:
            return (
                f"{selected_context} Start by validating the records behind {top_factors}. "
                "Then compare the finding against procurement documents, supplier history, and prior audit notes before escalating."
            )

        if "why" in normalized_question or "driver" in normalized_question or "factor" in normalized_question:
            if risk_score < 40 or risk_level.lower() == "low":
                return (
                    f"{selected_context} {lgu_name} is rated Low risk at {risk_score:.1f}/100, so it is not considered strongly risky in the current scoring profile. "
                    f"The listed items are monitoring points rather than major red flags: {top_factors}."
                )
            return (
                f"{selected_context} Its {risk_level} risk profile is mainly explained by {top_factors}. "
                f"The score is {risk_score:.1f}/100, so reviewers should focus on the strongest indicators first."
            )

        if "compare" in normalized_question or "severe" in normalized_question:
            return (
                f"{selected_context} A {risk_level} rating at {risk_score:.1f}/100 means this profile should be prioritized relative to lower-scoring LGUs. "
                "Use the ranking table and audit details to compare whether the same factors appear elsewhere."
            )

        return (
            f"{selected_context} The useful evidence to inspect is {top_factors}. "
            "The current data can guide review priority, but it should be confirmed against source procurement and audit records."
        )

    def _headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    def _payload(self, prompt: str) -> dict[str, Any]:
        api_url = self.api_url.lower()
        if "chat/completions" in api_url or "openai.com" in api_url:
            return {
                "model": self.model,
                "messages": [
                    {
                        "role": "system",
                        "content": BANTAI_SYSTEM_PROMPT,
                    },
                    {"role": "user", "content": prompt},
                ],
                "max_tokens": 220,
                "temperature": 0.2,
            }

        if "/api/chat" in api_url:
            return {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "stream": False,
                "options": {"temperature": 0.2},
            }

        if "/api/generate" in api_url:
            return {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.2},
            }

        return {
            "model": self.model,
            "prompt": prompt,
            "max_tokens": 220,
            "temperature": 0.2,
        }

    def _payload_with_tokens(self, prompt: str, max_tokens: int = 700) -> dict[str, Any]:
        payload = self._payload(prompt)
        if "messages" in payload:
            payload["max_tokens"] = max_tokens
        else:
            payload["max_tokens"] = max_tokens
        return payload

    def _extract_text(self, response: requests.Response) -> str:
        try:
            data = response.json()
        except ValueError:
            return response.text.strip()

        if isinstance(data, str):
            return data.strip()

        if isinstance(data, dict):
            choices = data.get("choices")
            if isinstance(choices, list) and choices:
                first = choices[0] or {}
                message = first.get("message") if isinstance(first, dict) else None
                if isinstance(message, dict) and message.get("content"):
                    return str(message["content"]).strip()
                if isinstance(first, dict) and first.get("text"):
                    return str(first["text"]).strip()

            message = data.get("message")
            if isinstance(message, dict) and message.get("content"):
                return str(message["content"]).strip()

            for key in ("response", "result", "text", "explanation", "content"):
                if data.get(key):
                    return str(data[key]).strip()

        return ""

    def _generate_from_prompt(self, prompt: str, fallback: str) -> dict[str, Any]:
        return self._request_prompt(prompt, fallback, max_tokens=220, timeout=30)

    def _generate_long_from_prompt(self, prompt: str, fallback: str) -> dict[str, Any]:
        return self._request_prompt(prompt, fallback, max_tokens=700, timeout=45)

    def _request_prompt(self, prompt: str, fallback: str, max_tokens: int, timeout: int) -> dict[str, Any]:
        if not self.configured:
            return {
                "text": fallback,
                "used_ai": False,
                "fallback_reason": "LLM_API_URL is not configured.",
            }

        try:
            response = requests.post(
                self.api_url,
                json=self._payload_with_tokens(prompt, max_tokens=max_tokens),
                headers=self._headers(),
                timeout=timeout,
            )
            response.raise_for_status()
            result = self._extract_text(response)
            if result:
                return {
                    "text": result,
                    "used_ai": True,
                    "fallback_reason": "",
                }
            return {
                "text": fallback,
                "used_ai": False,
                "fallback_reason": "The LLM provider returned an empty response.",
            }
        except requests.exceptions.HTTPError as error:
            status_code = error.response.status_code if error.response is not None else "unknown"
            return {
                "text": fallback,
                "used_ai": False,
                "fallback_reason": f"LLM provider returned HTTP {status_code}.",
            }
        except requests.exceptions.Timeout:
            return {
                "text": fallback,
                "used_ai": False,
                "fallback_reason": "LLM provider request timed out.",
            }
        except requests.exceptions.RequestException:
            return {
                "text": fallback,
                "used_ai": False,
                "fallback_reason": "LLM provider request failed.",
            }

    def generate_result(self, lgu_name: str, risk_score: float, risk_level: str, factors: dict | None = None) -> dict[str, Any]:
        if factors is None:
            factors = {}

        fallback = self.build_fallback_explanation(lgu_name, risk_score, risk_level, factors)
        result = self._generate_from_prompt(
            self.build_explanation_prompt(lgu_name, risk_score, risk_level, factors),
            fallback,
        )
        return {
            "explanation": result["text"],
            "used_ai": result["used_ai"],
            "fallback_reason": result["fallback_reason"],
        }

    def answer_question_result(
        self,
        lgu_name: str,
        risk_score: float,
        risk_level: str,
        factors: dict | None,
        question: str,
    ) -> dict[str, Any]:
        factors = factors or {}
        if not self.is_bantay_related_question(question):
            return {
                "answer": BANTAI_SCOPE_REFUSAL,
                "used_ai": False,
                "fallback_reason": "",
            }

        fallback = self.build_fallback_answer(lgu_name, risk_score, risk_level, factors, question)
        result = self._generate_from_prompt(
            self.build_question_prompt(lgu_name, risk_score, risk_level, factors, question),
            fallback,
        )
        return {
            "answer": result["text"],
            "used_ai": result["used_ai"],
            "fallback_reason": result["fallback_reason"],
        }

    def checklist_result(self, profile: dict[str, Any]) -> dict[str, Any]:
        profile_json = json.dumps(profile, ensure_ascii=False, indent=2)
        fallback = (
            f"Checklist for {profile.get('name', 'selected LGU')}:\n"
            "1. Validate the risk score factors against source records.\n"
            "2. Review procurement files, supplier records, canvass documents, inspection reports, and acceptance documents.\n"
            "3. Check whether audit findings are repeated, unresolved, or tied to high-value transactions.\n"
            "4. Confirm that the finding is a risk indicator, not proof of misconduct.\n"
            "5. Record reviewer notes and mark whether follow-up is needed."
        )
        prompt = f"""Create a practical audit review checklist for this LGU risk profile.
Use 6-8 checklist items. Make each item actionable and evidence-based.
Do not claim proven corruption. Focus on records to inspect and reviewer decisions.

LGU profile:
{profile_json}

Checklist:"""
        result = self._generate_long_from_prompt(prompt, fallback)
        return {
            "checklist": result["text"],
            "used_ai": result["used_ai"],
            "fallback_reason": result["fallback_reason"],
        }

    def compare_result(self, left: dict[str, Any], right: dict[str, Any]) -> dict[str, Any]:
        left_json = json.dumps(left, ensure_ascii=False, indent=2)
        right_json = json.dumps(right, ensure_ascii=False, indent=2)
        fallback = (
            f"{left.get('name', 'First LGU')} has a score of {left.get('score', 0)}/100, while "
            f"{right.get('name', 'Second LGU')} has a score of {right.get('score', 0)}/100. "
            "Compare the strongest factor values, procurement exposure, and audit findings to decide which profile needs earlier review."
        )
        prompt = f"""Compare two LGU risk profiles for a government reviewer.
Return a concise structured comparison with:
- Bottom line
- Why one is riskier
- Key factor differences
- Suggested next review step
Use only the provided data and do not claim proven corruption.

LGU A:
{left_json}

LGU B:
{right_json}

Comparison:"""
        result = self._generate_long_from_prompt(prompt, fallback)
        return {
            "comparison": result["text"],
            "used_ai": result["used_ai"],
            "fallback_reason": result["fallback_reason"],
        }

    def report_result(self, title: str, profiles: list[dict[str, Any]], notes: str = "") -> dict[str, Any]:
        profiles_json = json.dumps(profiles, ensure_ascii=False, indent=2)
        fallback_items = "\n".join(
            f"- {item.get('name', 'LGU')}: {item.get('riskLevel', item.get('risk_level', 'Unknown'))} risk, score {item.get('score', 0)}/100"
            for item in profiles[:8]
        )
        fallback = (
            f"{title}\n\nExecutive Summary\n{fallback_items or '- No LGUs selected.'}\n\n"
            "Reviewer Notes\n"
            f"{notes or 'No additional reviewer notes provided.'}\n\n"
            "Recommended Follow-up\nValidate scoring factors, procurement records, and audit findings before escalation."
        )
        prompt = f"""Draft a concise audit risk report section for the selected LGUs.
Use these sections:
1. Executive Summary
2. LGUs Reviewed
3. Key Risk Themes
4. Recommended Follow-up
5. Caveat
Keep it professional, evidence-aware, and suitable for government reviewers. Do not claim proven corruption.

Report title: {title}
Reviewer notes: {notes or 'None'}
Selected LGU profiles:
{profiles_json}

Report:"""
        result = self._generate_long_from_prompt(prompt, fallback)
        return {
            "report": result["text"],
            "used_ai": result["used_ai"],
            "fallback_reason": result["fallback_reason"],
        }

    def generate(self, lgu_name: str, risk_score: float, risk_level: str, factors: dict | None = None) -> str:
        return self.generate_result(lgu_name, risk_score, risk_level, factors)["explanation"]

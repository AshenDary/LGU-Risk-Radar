import os
import requests


class LLMService:
    """
    Wrapper for external LLM calls to generate risk explanations.
    Supports any LLM provider with a standard completion API.
    """

    def __init__(self, api_url: str = None, api_key: str = None):
        self.api_url = api_url or os.getenv("LLM_API_URL")
        self.api_key = api_key or os.getenv("LLM_API_KEY")

    def build_explanation_prompt(self, lgu_name: str, risk_score: float, risk_level: str, factors: dict) -> str:
        """
        Build a structured prompt for LLM risk explanation generation.
        
        Args:
            lgu_name: Name of the Local Government Unit
            risk_score: Numeric risk score (0-100)
            risk_level: Risk level category (low, medium, high, critical)
            factors: Dictionary of risk factors contributing to the score
        
        Returns:
            Formatted prompt string for LLM
        """
        prompt = f"""You are a risk analysis expert for Local Government Units (LGUs). 
Based on the following LGU risk profile, provide a concise 2-3 sentence explanation of the risk level and key contributing factors.

LGU Name: {lgu_name}
Risk Score: {risk_score}/100
Risk Level: {risk_level.upper()}
Contributing Factors: {factors}

Provide a clear, actionable explanation suitable for government officials."""
        return prompt

    def generate(self, lgu_name: str, risk_score: float, risk_level: str, factors: dict = None) -> str:
        """
        Generate an LLM-powered explanation for LGU risk assessment.
        
        Args:
            lgu_name: Name of the LGU
            risk_score: Numeric risk score (0-100)
            risk_level: Risk level (low, medium, high, critical)
            factors: Dictionary of factors contributing to the score
            
        Returns:
            Explanation string, or fallback message if LLM unavailable
        """
        if not self.api_url:
            # Fallback: return a basic template explanation
            default_factors = factors or {}
            return f"{lgu_name} has a {risk_level} risk level (score: {risk_score}/100) due to: {', '.join(f'{k}: {v}' for k, v in default_factors.items())}. Review the risk assessment dashboard for details."
        
        if factors is None:
            factors = {}
            
        prompt = self.build_explanation_prompt(lgu_name, risk_score, risk_level, factors)
        
        try:
            # Generic LLM API call (adapt headers/payload to your provider)
            resp = requests.post(
                self.api_url,
                json={"prompt": prompt, "max_tokens": 200},
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=10
            )
            if resp.ok:
                # Parse response (adjust based on your LLM provider's format)
                result = resp.text if isinstance(resp.text, str) else resp.json().get("result", "")
                return result if result else f"Risk explanation generated for {lgu_name} (score: {risk_score})."
            else:
                return f"LLM request failed with status {resp.status_code}. Fall back to score-based explanation: {lgu_name} is flagged as {risk_level} risk."
        except requests.exceptions.Timeout:
            return f"Explanation generation timed out for {lgu_name}. Review assessment manually."
        except Exception as e:
            return f"Error generating explanation: {str(e)}. Contact system administrator."

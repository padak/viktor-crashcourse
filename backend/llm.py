"""LLM module for Life Coach App.

This module provides functions to interact with Claude AI for analyzing
user problems and generating recommendations using structured outputs.
"""

import json
import logging
import os
from typing import Any

from anthropic import AsyncAnthropic
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Initialize the Anthropic client
client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Model to use - Sonnet 4.5 supports structured outputs
MODEL = "claude-sonnet-4-5"


async def analyze_problems(feeling: str, troubles: str, changes: str) -> list[dict[str, Any]]:
    """Analyze user input and identify 3 main life problems.

    Args:
        feeling: How the user is currently feeling.
        troubles: What troubles or challenges the user is facing.
        changes: What changes the user wants to make in their life.

    Returns:
        A list of exactly 3 problems, each containing:
        - id (int): Unique identifier for the problem (1, 2, or 3)
        - title (str): Short title describing the problem
        - description (str): Detailed description of the problem

    Raises:
        ValueError: If the API response is invalid.
        anthropic.APIError: If the API call fails.
    """
    system_prompt = """Jsi empatický asistent životního kouče. Tvým úkolem je analyzovat
pocity uživatele, jeho problémy a požadované změny a identifikovat 3 hlavní životní problémy.

Identifikuj přesně 3 problémy na základě toho, co uživatel sdílí. Každý problém by měl mít:
- id: číslo (1, 2 nebo 3)
- title: krátký, jasný název (max 50 znaků) - ČESKY
- description: podrobný, ale stručný popis problému (max 200 znaků) - ČESKY

Buď empatický a vnímavý ve své analýze. VŽDY odpovídej v češtině."""

    user_message = f"""Prosím analyzuj mou situaci a identifikuj mé 3 hlavní životní problémy:

Jak se cítím: {feeling}

Co mě trápí: {troubles}

Co chci změnit: {changes}"""

    logger.info("Calling Claude API with structured output for problem analysis")

    # Use beta API with structured outputs
    response = await client.beta.messages.create(
        model=MODEL,
        max_tokens=1024,
        betas=["structured-outputs-2025-11-13"],
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_message}
        ],
        output_format={
            "type": "json_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "problems": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "integer"},
                                "title": {"type": "string"},
                                "description": {"type": "string"}
                            },
                            "required": ["id", "title", "description"],
                            "additionalProperties": False
                        }
                    }
                },
                "required": ["problems"],
                "additionalProperties": False
            }
        }
    )

    logger.info(f"Response stop_reason: {response.stop_reason}")

    # Parse the structured response
    response_text = response.content[0].text
    logger.info(f"Structured response: {response_text[:500]}")

    result = json.loads(response_text)
    problems = result["problems"]

    # Validate we got exactly 3 problems
    if len(problems) != 3:
        raise ValueError(f"Expected exactly 3 problems, got {len(problems)}")

    return problems


async def get_recommendations(problems: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Generate actionable recommendations for each confirmed problem.

    Args:
        problems: A list of problem dictionaries, each containing:
            - id (int): Unique identifier for the problem
            - title (str): Short title describing the problem
            - description (str): Detailed description of the problem

    Returns:
        A list of recommendations, each containing:
        - problem_id (int): The ID of the problem this recommendation addresses
        - advice (str): Actionable advice for addressing the problem

    Raises:
        ValueError: If the API response is invalid.
        anthropic.APIError: If the API call fails.
    """
    system_prompt = """Jsi empatický a praktický životní kouč. Tvým úkolem je poskytnout
konkrétní doporučení pro každý životní problém, který uživatel potvrdil.

Pro každý problém poskytni konkrétní, realizovatelnou radu, která je:
- Praktická a dosažitelná
- Specifická, ne obecná
- Povzbuzující a podpůrná
- Zaměřená na konkrétní kroky, které uživatel může podniknout

Každé doporučení by mělo mít max 300 znaků. VŽDY odpovídej v češtině."""

    # Format the problems for the prompt
    problems_text = "\n".join([
        f"Problém {p['id']}: {p['title']}\nPopis: {p['description']}"
        for p in problems
    ])

    user_message = f"""Prosím poskytni konkrétní doporučení pro každý z těchto potvrzených problémů:

{problems_text}"""

    logger.info("Calling Claude API with structured output for recommendations")

    response = await client.beta.messages.create(
        model=MODEL,
        max_tokens=1024,
        betas=["structured-outputs-2025-11-13"],
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_message}
        ],
        output_format={
            "type": "json_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "recommendations": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "problem_id": {"type": "integer"},
                                "advice": {"type": "string"}
                            },
                            "required": ["problem_id", "advice"],
                            "additionalProperties": False
                        }
                    }
                },
                "required": ["recommendations"],
                "additionalProperties": False
            }
        }
    )

    logger.info(f"Response stop_reason: {response.stop_reason}")

    # Parse the structured response
    response_text = response.content[0].text
    logger.info(f"Structured response: {response_text[:500]}")

    result = json.loads(response_text)
    recommendations = result["recommendations"]

    return recommendations

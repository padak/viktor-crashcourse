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
    system_prompt = """You are an empathetic life coach assistant. Your task is to analyze
the user's feelings, troubles, and desired changes to identify their 3 main life problems.

Identify exactly 3 problems based on what the user shares. Each problem should have:
- id: a number (1, 2, or 3)
- title: a short, clear title (max 50 characters)
- description: a detailed but concise description (max 200 characters)

Be empathetic and insightful in your analysis."""

    user_message = f"""Please analyze my situation and identify my 3 main life problems:

How I'm feeling: {feeling}

My troubles: {troubles}

Changes I want to make: {changes}"""

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
    system_prompt = """You are an empathetic and practical life coach. Your task is to provide
actionable recommendations for each life problem the user has confirmed.

For each problem, provide specific, actionable advice that is:
- Practical and achievable
- Specific, not generic
- Encouraging and supportive
- Focused on concrete steps the user can take

Each recommendation should be max 300 characters."""

    # Format the problems for the prompt
    problems_text = "\n".join([
        f"Problem {p['id']}: {p['title']}\nDescription: {p['description']}"
        for p in problems
    ])

    user_message = f"""Please provide actionable recommendations for each of these confirmed problems:

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

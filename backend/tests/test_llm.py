"""Tests for the LLM module functions."""

import json
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from llm import analyze_problems, get_recommendations


def create_mock_response(content: str) -> MagicMock:
    """Create a mock Anthropic API response."""
    mock_response = MagicMock()
    mock_content = MagicMock()
    mock_content.text = content
    mock_response.content = [mock_content]
    return mock_response


@pytest.mark.asyncio
async def test_analyze_problems_returns_three_problems():
    """Test that analyze_problems returns exactly 3 problems."""
    mock_problems = [
        {"id": 1, "title": "Work Stress", "description": "Too much workload"},
        {"id": 2, "title": "Sleep Issues", "description": "Cannot sleep well"},
        {"id": 3, "title": "Social Isolation", "description": "Lack of friends"},
    ]
    mock_response = create_mock_response(json.dumps(mock_problems))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        result = await analyze_problems(
            feeling="stressed",
            troubles="work and relationships",
            changes="better balance",
        )

        assert len(result) == 3
        assert result[0]["id"] == 1
        assert result[0]["title"] == "Work Stress"
        assert result[1]["id"] == 2
        assert result[2]["id"] == 3


@pytest.mark.asyncio
async def test_analyze_problems_validates_response_structure():
    """Test that analyze_problems validates each problem has required fields."""
    mock_problems = [
        {"id": 1, "title": "Work Stress", "description": "Too much workload"},
        {"id": 2, "title": "Sleep Issues", "description": "Cannot sleep well"},
        {"id": 3, "title": "Social Isolation", "description": "Lack of friends"},
    ]
    mock_response = create_mock_response(json.dumps(mock_problems))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        result = await analyze_problems(
            feeling="tired",
            troubles="everything",
            changes="peace",
        )

        for problem in result:
            assert "id" in problem
            assert "title" in problem
            assert "description" in problem


@pytest.mark.asyncio
async def test_analyze_problems_invalid_json_response():
    """Test that analyze_problems raises ValueError for invalid JSON."""
    mock_response = create_mock_response("This is not valid JSON at all")

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        with pytest.raises(ValueError, match="Failed to parse LLM response as JSON"):
            await analyze_problems(
                feeling="stressed",
                troubles="work",
                changes="relaxation",
            )


@pytest.mark.asyncio
async def test_analyze_problems_wrong_number_of_problems():
    """Test that analyze_problems raises ValueError for wrong number of problems."""
    # Only 2 problems instead of 3
    mock_problems = [
        {"id": 1, "title": "Work Stress", "description": "Too much workload"},
        {"id": 2, "title": "Sleep Issues", "description": "Cannot sleep well"},
    ]
    mock_response = create_mock_response(json.dumps(mock_problems))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        with pytest.raises(ValueError, match="Expected exactly 3 problems"):
            await analyze_problems(
                feeling="stressed",
                troubles="work",
                changes="relaxation",
            )


@pytest.mark.asyncio
async def test_analyze_problems_missing_required_fields():
    """Test that analyze_problems raises ValueError when problem is missing fields."""
    mock_problems = [
        {"id": 1, "title": "Work Stress"},  # Missing 'description'
        {"id": 2, "title": "Sleep Issues", "description": "Cannot sleep well"},
        {"id": 3, "title": "Social Isolation", "description": "Lack of friends"},
    ]
    mock_response = create_mock_response(json.dumps(mock_problems))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        with pytest.raises(ValueError, match="Problem missing required fields"):
            await analyze_problems(
                feeling="stressed",
                troubles="work",
                changes="relaxation",
            )


@pytest.mark.asyncio
async def test_analyze_problems_non_list_response():
    """Test that analyze_problems raises ValueError for non-list response."""
    mock_response = create_mock_response(json.dumps({"error": "not a list"}))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        with pytest.raises(ValueError, match="Expected exactly 3 problems"):
            await analyze_problems(
                feeling="stressed",
                troubles="work",
                changes="relaxation",
            )


@pytest.mark.asyncio
async def test_get_recommendations_returns_correct_count():
    """Test that get_recommendations returns one recommendation per problem."""
    input_problems = [
        {"id": 1, "title": "Work Stress", "description": "Too much workload"},
        {"id": 2, "title": "Sleep Issues", "description": "Cannot sleep well"},
    ]

    mock_recommendations = [
        {"problem_id": 1, "advice": "Take breaks regularly"},
        {"problem_id": 2, "advice": "Establish a sleep routine"},
    ]
    mock_response = create_mock_response(json.dumps(mock_recommendations))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        result = await get_recommendations(problems=input_problems)

        assert len(result) == 2
        assert result[0]["problem_id"] == 1
        assert result[0]["advice"] == "Take breaks regularly"
        assert result[1]["problem_id"] == 2


@pytest.mark.asyncio
async def test_get_recommendations_validates_response_structure():
    """Test that get_recommendations validates each recommendation has required fields."""
    input_problems = [
        {"id": 1, "title": "Work Stress", "description": "Too much workload"},
    ]

    mock_recommendations = [
        {"problem_id": 1, "advice": "Take breaks regularly"},
    ]
    mock_response = create_mock_response(json.dumps(mock_recommendations))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        result = await get_recommendations(problems=input_problems)

        for rec in result:
            assert "problem_id" in rec
            assert "advice" in rec


@pytest.mark.asyncio
async def test_get_recommendations_invalid_json_response():
    """Test that get_recommendations raises ValueError for invalid JSON."""
    input_problems = [
        {"id": 1, "title": "Work Stress", "description": "Too much workload"},
    ]

    mock_response = create_mock_response("Not valid JSON")

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        with pytest.raises(ValueError, match="Failed to parse LLM response as JSON"):
            await get_recommendations(problems=input_problems)


@pytest.mark.asyncio
async def test_get_recommendations_non_list_response():
    """Test that get_recommendations raises ValueError for non-list response."""
    input_problems = [
        {"id": 1, "title": "Work Stress", "description": "Too much workload"},
    ]

    mock_response = create_mock_response(json.dumps({"error": "not a list"}))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        with pytest.raises(ValueError, match="Expected a list of recommendations"):
            await get_recommendations(problems=input_problems)


@pytest.mark.asyncio
async def test_get_recommendations_missing_required_fields():
    """Test that get_recommendations raises ValueError for missing fields."""
    input_problems = [
        {"id": 1, "title": "Work Stress", "description": "Too much workload"},
    ]

    mock_recommendations = [
        {"problem_id": 1},  # Missing 'advice'
    ]
    mock_response = create_mock_response(json.dumps(mock_recommendations))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        with pytest.raises(ValueError, match="Recommendation missing required fields"):
            await get_recommendations(problems=input_problems)


@pytest.mark.asyncio
async def test_get_recommendations_empty_problems_list():
    """Test get_recommendations with empty problems list."""
    mock_recommendations: list = []
    mock_response = create_mock_response(json.dumps(mock_recommendations))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        result = await get_recommendations(problems=[])

        assert result == []


@pytest.mark.asyncio
async def test_analyze_problems_calls_api_with_correct_parameters():
    """Test that analyze_problems calls the Anthropic API correctly."""
    mock_problems = [
        {"id": 1, "title": "Test 1", "description": "Desc 1"},
        {"id": 2, "title": "Test 2", "description": "Desc 2"},
        {"id": 3, "title": "Test 3", "description": "Desc 3"},
    ]
    mock_response = create_mock_response(json.dumps(mock_problems))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        await analyze_problems(
            feeling="stressed",
            troubles="work",
            changes="balance",
        )

        mock_client.messages.create.assert_called_once()
        call_kwargs = mock_client.messages.create.call_args.kwargs

        assert call_kwargs["model"] == "claude-haiku-4-5-20251001"
        assert call_kwargs["max_tokens"] == 1024
        assert "system" in call_kwargs
        assert len(call_kwargs["messages"]) == 1
        assert call_kwargs["messages"][0]["role"] == "user"


@pytest.mark.asyncio
async def test_get_recommendations_calls_api_with_correct_parameters():
    """Test that get_recommendations calls the Anthropic API correctly."""
    input_problems = [
        {"id": 1, "title": "Test", "description": "Desc"},
    ]

    mock_recommendations = [
        {"problem_id": 1, "advice": "Test advice"},
    ]
    mock_response = create_mock_response(json.dumps(mock_recommendations))

    with patch("llm.client") as mock_client:
        mock_client.messages.create = AsyncMock(return_value=mock_response)

        await get_recommendations(problems=input_problems)

        mock_client.messages.create.assert_called_once()
        call_kwargs = mock_client.messages.create.call_args.kwargs

        assert call_kwargs["model"] == "claude-haiku-4-5-20251001"
        assert call_kwargs["max_tokens"] == 1024
        assert "system" in call_kwargs
        assert len(call_kwargs["messages"]) == 1
        assert call_kwargs["messages"][0]["role"] == "user"
        assert "Test" in call_kwargs["messages"][0]["content"]

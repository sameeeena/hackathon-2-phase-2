"""
MCP Tools for Conversation Operations
Following the specifications for standardized database operations
"""
from typing import List, Optional
from sqlmodel import Session, select
from datetime import datetime
from uuid import UUID
from backend.models.conversation import Conversation
from backend.models.message import Message, SenderType


def create_conversation(session: Session, user_id: str, title: Optional[str] = None) -> Conversation:
    """
    Create a new conversation
    """
    conversation = Conversation(
        user_id=user_id,
        title=title
    )
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation


def get_conversation(session: Session, conversation_id: UUID, user_id: str) -> Optional[Conversation]:
    """
    Get a specific conversation for a user
    """
    return session.exec(
        select(Conversation)
        .where(Conversation.id == conversation_id)
        .where(Conversation.user_id == user_id)
    ).first()


def get_user_conversations(session: Session, user_id: str) -> List[Conversation]:
    """
    Get all conversations for a user
    """
    return session.exec(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
    ).all()


def add_message(session: Session, conversation_id: UUID, sender_type: SenderType, content: str,
                metadata_json: Optional[str] = None) -> Message:
    """
    Add a message to a conversation
    """
    message = Message(
        conversation_id=conversation_id,
        sender_type=sender_type,
        content=content,
        metadata_json=metadata_json
    )
    session.add(message)
    session.commit()
    session.refresh(message)
    return message


def get_conversation_messages(session: Session, conversation_id: UUID) -> List[Message]:
    """
    Get all messages in a conversation
    """
    return session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.timestamp.asc())
    ).all()


def update_conversation_title(session: Session, conversation_id: UUID, user_id: str, title: str) -> Optional[Conversation]:
    """
    Update conversation title
    """
    conversation = session.exec(
        select(Conversation)
        .where(Conversation.id == conversation_id)
        .where(Conversation.user_id == user_id)
    ).first()

    if not conversation:
        return None

    conversation.title = title
    conversation.updated_at = datetime.utcnow()

    session.add(conversation)
    session.commit()
    session.refresh(conversation)

    return conversation
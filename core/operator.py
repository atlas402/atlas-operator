from typing import Optional, Dict, Any, List
from anthropic import Anthropic

class AtlasOperator:
    def __init__(
        self,
        anthropic_api_key: str,
        facilitator_url: str
    ):
        self.client = Anthropic(api_key=anthropic_api_key)
        self.facilitator_url = facilitator_url
        self.conversation_history: List[Dict[str, str]] = []
        
    async def chat(
        self,
        message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, str]:
        messages = [
            {'role': msg['role'], 'content': msg['content']}
            for msg in self.conversation_history
        ]
        messages.append({'role': 'user', 'content': message})
        
        system_prompt = self._build_system_prompt(context or {})
        
        response = self.client.messages.create(
            model='claude-3-5-opus-20241022',
            max_tokens=2048,
            system=system_prompt,
            messages=messages
        )
        
        content = response.content[0].text
        
        self.conversation_history.append({'role': 'user', 'content': message})
        self.conversation_history.append({'role': 'assistant', 'content': content})
        
        return {'message': content}
    
    async def discover_services(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        import aiohttp
        url = f"{self.facilitator_url}/discovery/resources"
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=filters or {}) as response:
                data = await response.json()
                return data.get('resources', [])
    
    def _build_system_prompt(self, context: Dict[str, Any]) -> str:
        return f"""You are Atlas Operator, the AI control plane for Atlas402.
Network: {context.get('network', 'base')}
Budget: {context.get('budget', 'unlimited')}"""





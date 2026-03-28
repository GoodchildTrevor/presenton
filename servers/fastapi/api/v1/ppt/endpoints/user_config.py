from fastapi import APIRouter
from utils.get_env import get_can_change_keys_env, get_flux_url_env

USER_CONFIG_ROUTER = APIRouter(prefix="/user-config")


@USER_CONFIG_ROUTER.get("")
async def get_user_config():
    """
    Get user configuration including CAN_CHANGE_KEYS and FLUX_URL.
    """
    can_change_keys = get_can_change_keys_env()
    flux_url = get_flux_url_env()
    
    return {
        "can_change_keys": can_change_keys != "false" if can_change_keys else False,
        "FLUX_URL": flux_url
    }


@USER_CONFIG_ROUTER.get("/can-change-keys")
async def get_can_change_keys():
    """
    Get whether keys can be changed.
    """
    can_change_keys = get_can_change_keys_env()
    return {"can_change_keys": can_change_keys != "false" if can_change_keys else False}
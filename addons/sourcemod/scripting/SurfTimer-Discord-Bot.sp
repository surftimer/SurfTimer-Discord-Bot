#include <ripext>
#include <sourcemod>
#include <surftimer>
#include <colorvariables>
#pragma newdecls required
#pragma semicolon 1

// #define DEBUGGING

public Plugin myinfo =
{
	name        = "SurfTimer-Discord-Bot",
	author      = "Sarrus",
	description = "",
	version     = "1.0.0",
	url         = "https://github.com/Sarrus1/SurfTimer-Discord-Bot"
};

HTTPRequest connection;

ConVar g_cvApiKey;
ConVar g_cvApiHost;
ConVar g_cvApiPort;

char g_szApiKey[512];
char g_szApiHost[128];
char g_szApiPort[16];
char g_szCurrentMap[128];

public void OnPluginStart()
{
  g_cvApiKey = CreateConVar("sm_surftimer_discord_bot_api_key", "", "The API key to your Discord BOT.", FCVAR_PROTECTED);
  g_cvApiHost = CreateConVar("sm_surftimer_discord_bot_api_host", "", "The host of your Discord BOT.", FCVAR_PROTECTED);
  g_cvApiPort = CreateConVar("sm_surftimer_discord_bot_api_port", "", "The port of your Discord BOT.", FCVAR_PROTECTED);

  AutoExecConfig(true, "SurfTimer-Discord-Bot");

  RegAdminCmd("sm_ck_discord_bot_test", CommandDiscordTest, ADMFLAG_ROOT, "Test the discord bot API.");
}

public void OnMapStart()
{
	GetCurrentMap(g_szCurrentMap, sizeof g_szCurrentMap);
	RemoveWorkshop(g_szCurrentMap, sizeof g_szCurrentMap);
}

public void OnConfigsExecuted()
{
	GetConVarString(g_cvApiKey, g_szApiKey, sizeof g_szApiKey);
	GetConVarString(g_cvApiHost, g_szApiHost, sizeof g_szApiHost);
	GetConVarString(g_cvApiPort, g_szApiPort, sizeof g_szApiPort);
}


public Action CommandDiscordTest(int client, int args)
{
  CPrintToChat(client, "{blue}[SurfTimer-Discord-BOT] {green}Sending map record test message.");
  surftimer_OnNewRecord(client, 0, "00:30:36", "(-00:00:10)", 0);
  CPrintToChat(client, "{blue}[SurfTimer-Discord-BOT] {green}Sending bonus record test message.");
  surftimer_OnNewRecord(client, 1, "00:30:36", "(-00:00:10)", 0);
  return Plugin_Handled;
}

public void surftimer_OnNewRecord(int client, int style, char[] time, char[] timeDif, int bonusGroup)
{
  char szSteamID64[64];
  GetClientAuthId(client, AuthId_SteamID64, szSteamID64, sizeof szSteamID64);
  sendRecordToApi(szSteamID64, style, time, timeDif, bonusGroup);
}

void sendRecordToApi(const char[] steamID64, int style, const char[] time, const char[] timeDif, int bonusGroup){
  JSONObject data = new JSONObject();
  data.SetString("apiKey", g_szApiKey);
  data.SetString("steamID64", steamID64);
  data.SetString("mapName", g_szCurrentMap);
  data.SetString("newTime", time);
  data.SetString("timeDiff", timeDif);
  data.SetInt("bonusGroup", bonusGroup);
  data.SetInt("style", style);

  char szRequestBuffer[1024];
  Format(szRequestBuffer, sizeof szRequestBuffer, "http://%s:%s/record", g_szApiHost, g_szApiPort);
  connection = new HTTPRequest(szRequestBuffer);
  connection.Post(view_as<JSON>(data), onRecordSent);
}

stock bool IsValidClient(int iClient, bool bNoBots = true)
{
	if (iClient <= 0 || iClient > MaxClients || !IsClientConnected(iClient) || (bNoBots && IsFakeClient(iClient)))
	{
		return false;
	}
	return IsClientInGame(iClient);
}

stock void RemoveWorkshop(char[] szMapName, int len)
{
	int  i = 0;
	char szBuffer[16], szCompare[1] = "/";

	// Return if "workshop/" is not in the mapname
	if (ReplaceString(szMapName, len, "workshop/", "", true) != 1)
		return;

	// Find the index of the last /
	do
	{
		szBuffer[i] = szMapName[i];
		i++;
	}
	while (szMapName[i] != szCompare[0]);
	szBuffer[i] = szCompare[0];
	ReplaceString(szMapName, len, szBuffer, "", true);
}

void onRecordSent(HTTPResponse response, int client)
{
	#if defined DEBUGGING
	{
		PrintToServer("Processed API POST, status %d", response.Status);
		if (response.Status != HTTPStatus_Created)
		{
			PrintToServer("An error has occured while sending the API POST.");
			return;
		}
		PrintToServer("The API POST has been sent successfuly.");
	}
  #endif
}
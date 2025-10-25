ESX.RegisterCommand(
    "setslots",
    "admin",
    function(xPlayer, args)
        Database:SetSlots(args.identifier, args.slots)
        xPlayer.triggerEvent("esx:showNotification", TranslateCap("slotsadd", args.slots, args.identifier))
    end,
    true,
    {
        help = TranslateCap("command_setslots"),
        validate = true,
        arguments = {
            { name = "identifier", help = TranslateCap("command_identifier"), type = "string" },
            { name = "slots", help = TranslateCap("command_slots"), type = "number" },
        },
    }
)

ESX.RegisterCommand(
    "remslots",
    "admin",
    function(xPlayer, args)
        local removed = Database:RemoveSlots(args.identifier)

        if removed then
            xPlayer.triggerEvent("esx:showNotification", TranslateCap("slotsrem", args.identifier))
        end
    end,
    true,
    {
        help = TranslateCap("command_remslots"),
        validate = true,
        arguments = {
            { name = "identifier", help = TranslateCap("command_identifier"), type = "string" },
        },
    }
)

ESX.RegisterCommand(
    "enablechar",
    "admin",
    function(xPlayer, args)
        local enabled = Database:EnableSlot(args.identifier, args.charslot)
        if enabled then
            xPlayer.triggerEvent("esx:showNotification", TranslateCap("charenabled", args.charslot, args.identifier))
        else
            xPlayer.triggerEvent("esx:showNotification", TranslateCap("charnotfound", args.charslot, args.identifier))
        end
    end,
    true,
    {
        help = TranslateCap("command_enablechar"),
        validate = true,
        arguments = {
            { name = "identifier", help = TranslateCap("command_identifier"), type = "string" },
            { name = "charslot", help = TranslateCap("command_charslot"), type = "number" },
        },
    }
)

ESX.RegisterCommand(
    "disablechar",
    "admin",
    function(xPlayer, args)
        local disabled = Database:DisableSlot(args.identifier, args.charslot)
        if disabled then
            xPlayer.triggerEvent("esx:showNotification", TranslateCap("chardisabled", args.charslot, args.identifier))
        else
            xPlayer.triggerEvent("esx:showNotification", TranslateCap("charnotfound", args.charslot, args.identifier))
        end
    end,
    true,
    {
        help = TranslateCap("command_disablechar"),
        validate = true,
        arguments = {
            { name = "identifier", help = TranslateCap("command_identifier"), type = "string" },
            { name = "charslot", help = TranslateCap("command_charslot"), type = "number" },
        },
    }
)

RegisterCommand("forcelog", function(source)
    TriggerEvent("esx:playerLogout", source)
end, true)

-- Rewritten bancharacter command to use /relog instead of kick when configured
ESX.RegisterCommand(
    "bancharacter",
    "admin",
    function(xPlayer, args)
        local targetPlayer = ESX.GetPlayerFromId(args.playerid)
        
        if not targetPlayer then
            xPlayer.triggerEvent("esx:showNotification", "Hráč nebyl nalezen")
            return
        end
        
        local identifier = ESX.GetIdentifier(args.playerid)
        local currentChar = ESX.Players[identifier]
        
        if type(currentChar) ~= "string" then
            xPlayer.triggerEvent("esx:showNotification", "Hráč nemá vybranou postavu")
            return
        end
        
        local charSlot = tonumber(currentChar:match("char(%d+)"))
        
        if not charSlot then
            xPlayer.triggerEvent("esx:showNotification", "Nepodařilo se zjistit slot postavy")
            return
        end
        
        local reason = args.reason or "Ban přes příkaz"
        Database:BanCharacter(identifier, charSlot, args.timer, reason, xPlayer.identifier)
        
        -- Use /relog instead of kick if configured
        if Config.UseRelogInsteadOfKick then
            TriggerClientEvent("esx_multicharacter:forceRelog", args.playerid, string.format("Vaše postava byla zabanována na %s minut. Důvod: %s", args.timer, reason))
        else
            DropPlayer(args.playerid, string.format("Vaše postava byla zabanována na %s minut. Důvod: %s", args.timer, reason))
        end
        
        xPlayer.triggerEvent("esx:showNotification", string.format("Postava hráče %s (slot %s) byla zabanována na %s minut", GetPlayerName(args.playerid), charSlot, args.timer))
        
        print(("[^2BAN^7] Admin ^5%s^7 zabanoval postavu hráče ^5%s^7 (slot ^5%s^7) na ^5%s^7 minut. Důvod: ^5%s^7"):format(xPlayer.getName(), GetPlayerName(args.playerid), charSlot, args.timer, reason))
    end,
    true,
    {
        help = "Zabanovat postavu hráče",
        validate = true,
        arguments = {
            { name = "playerid", help = "ID hráče", type = "number" },
            { name = "timer", help = "Délka banu v minutách", type = "number" },
            { name = "reason", help = "Důvod banu (volitelné)", type = "string", optional = true },
        },
    }
)

-- Removed characteradmin command that was using ox_lib exports
-- Use the /bancharacter command instead: /bancharacter [playerid] [timer] [reason]

-- Added unbancharacter command as replacement for menu option
ESX.RegisterCommand(
    "unbancharacter",
    "admin",
    function(xPlayer, args)
        local unbanned = Database:UnbanCharacter(args.identifier, args.charslot)
        
        if unbanned then
            xPlayer.triggerEvent("esx:showNotification", string.format("Ban pro slot %s byl odebrán", args.charslot))
            print(("[^2UNBAN^7] Admin ^5%s^7 odebral ban pro slot ^5%s^7 (identifier: ^5%s^7)"):format(xPlayer.getName(), args.charslot, args.identifier))
        else
            xPlayer.triggerEvent("esx:showNotification", "Ban nebyl nalezen")
        end
    end,
    true,
    {
        help = "Odebrat ban postavy",
        validate = true,
        arguments = {
            { name = "identifier", help = "Identifier hráče", type = "string" },
            { name = "charslot", help = "Slot postavy", type = "number" },
        },
    }
)

-- Added listbans command to view all active bans
ESX.RegisterCommand(
    "listbans",
    "admin",
    function(xPlayer, args)
        local bans = Database:GetAllBans()
        
        if #bans == 0 then
            xPlayer.triggerEvent("esx:showNotification", "Žádné aktivní bany")
            print("^3[INFO]^7 Žádné aktivní character bany")
            return
        end
        
        print("^2[BANS]^7 Seznam aktivních character banů:")
        print("^2========================================^7")
        
        for i = 1, #bans do
            local ban = bans[i]
            local timeLeft = math.ceil((ban.banned_until - os.time()) / 60)
            print(string.format("^5%s^7 | Slot: ^5%s^7 | Zbývá: ^5%s^7 min | Důvod: ^5%s^7", 
                ban.identifier, 
                ban.char_slot, 
                timeLeft, 
                ban.reason or "Neuvedeno"
            ))
        end
        
        print("^2========================================^7")
        xPlayer.triggerEvent("esx:showNotification", string.format("Seznam %s banů byl vypsán do konzole", #bans))
    end,
    true,
    {
        help = "Zobrazit seznam všech aktivních character banů",
        validate = false,
    }
)

CreateThread(function()
    while true do
        Wait(300000) -- 5 minutes
        Database:CleanExpiredBans()
    end
end)

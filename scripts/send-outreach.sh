#!/bin/bash

# Auto Company Outreach Script
# Cycle #70 - Manual Outreach Execution
#
# This script opens all 20 target URLs in your browser
# You copy the message from the files and paste as comment
#
# Usage: ./send-outreach.sh

set -e

echo "🚀 Auto Company Outreach Execution"
echo "=================================="
echo ""
echo "This script will open all 20 outreach targets in your browser."
echo "For each target:"
echo "  1. Copy the message from the message file"
echo "  2. Paste as comment/reply on the post"
echo "  3. Mark as sent in the tracking table"
echo ""
read -p "Press Enter to start..."

# Product Hunt Tool Targets (10)
echo "📦 Opening Product Hunt Tool targets..."

# IndieHackers
echo "1/20: IndieHackers - Launching in 12 days"
xdg-open "https://www.indiehackers.com/post/i-m-launching-on-product-hunt-in-12-days-with-zero-customers-here-s-my-exact-plan-beaab1d1e1" &

sleep 2

# Reddit r/SideProject
echo "2/20: r/SideProject - Launching soon tips"
xdg-open "https://www.reddit.com/r/SideProject/comments/1hs4qmg/launching_on_product_hunt_soon_tips_for_side/" &

sleep 2

echo "3/20: r/SideProject - Coming soon page"
xdg-open "https://www.reddit.com/r/SideProject/comments/1bd997u/product_hunt_coming_soon_page/" &

sleep 2

echo "4/20: r/SideProject - How did you prepare"
xdg-open "https://www.reddit.com/r/SideProject/comments/1byx7yw/how_did_you_prepare_for_the_product_hunt_launch/" &

sleep 2

# Reddit r/SaaS
echo "5/20: r/SaaS - It's scary AF"
xdg-open "https://www.reddit.com/r/SaaS/comments/18wvp86/launching_on_product_hunt_its_scary_af/" &

sleep 2

echo "6/20: r/SaaS - Should I launch right away"
xdg-open "https://www.reddit.com/r/SaaS/comments/1987smv/should_i_launch_product_hunt_right_away/" &

sleep 2

echo "7/20: r/SaaS - Left my launch unnoticed"
xdg-open "https://www.reddit.com/r/SaaS/comments/1f0ux8c/i_left_my_product_hunt_launch_unnoticed_lol/" &

sleep 2

echo "8/20: r/SaaS - Accidentally launched, top 4"
xdg-open "https://www.reddit.com/r/SaaS/comments/1s1ug5m/accidentally_launched_on_product_hunt_were_top_4/" &

sleep 2

echo "9/20: r/SaaS - Still worth it"
xdg-open "https://www.reddit.com/r/SaaS/comments/1b4kywm/so_i_guess_the_product_hunt_launch_is_still_worth_it/" &

sleep 2

echo "10/20: r/SaaS - Biggest myth about launching"
xdg-open "https://www.reddit.com/r/SaaS/comments/1ddf3d6/product_hunt_the_biggest_myth_about_launching_2024/" &

sleep 2

# Bot Analytics Dashboard Targets (10)
echo ""
echo "📊 Opening Bot Analytics Dashboard targets..."

# Reddit r/Discord_Bots
echo "11/20: r/Discord_Bots - Looking for better analytics tools"
xdg-open "https://www.reddit.com/r/Discord_Bots/comments/1llzuk8/looking_for_better_analytics_tools_for_managing_a/" &

sleep 2

echo "12/20: r/Discord_Bots - Which stat bot is better"
xdg-open "https://www.reddit.com/r/Discord_Bots/comments/krzvo0/which_stat_bot_is_better_for_analytics/" &

sleep 2

echo "13/20: r/Discord_Bots - How to make Web Dashboard"
xdg-open "https://www.reddit.com/r/Discord_Bots/comments/1koca01/how_to_make_web_dashboard_for_discord_bots/" &

sleep 2

echo "14/20: r/Discord_Bots - Bot to Archive & Organize"
xdg-open "https://www.reddit.com/r/Discord_Bots/comments/1l6u58u/discord_bot_to_archive_organize_your_server/" &

sleep 2

echo "15/20: r/Discord_Bots - [PAID] Beta Testing"
xdg-open "https://www.reddit.com/r/Discord_Bots/comments/1r4fqm8/paid_seeking_5_discord_server_owners_for_beta/" &

sleep 2

echo "16/20: r/Discord_Bots - Google Sheets Bot"
xdg-open "https://www.reddit.com/r/Discord_Bots/comments/amesdf/google_sheets_bot/" &

sleep 2

echo "17/20: r/Discord_Bots - Pinging roles in nextcord"
xdg-open "https://www.reddit.com/r/Discord_Bots/comments/ula6fi/pinging_roles_in_nextcord/" &

sleep 2

echo "18/20: r/Discord_Bots - Looking for bot for Sheets values"
xdg-open "https://www.reddit.com/r/Discord_Bots/comments/fe7irf/looking_for_discord_bot_that_returns_values_from/" &

sleep 2

# Reddit r/Telegram
echo "19/20: r/Telegram - Docker Events Monitor"
xdg-open "https://www.reddit.com/r/Telegram/comments/1p2pzh1/lightweight_docker_events_monitor_for_telegram/" &

sleep 2

echo "20/20: r/Telegram - Directory for goods and shops"
xdg-open "https://www.reddit.com/r/Telegram/comments/n4ik0p/i_made_a_directory_for_goods_and_shops_from/" &

echo ""
echo "=================================="
echo "✅ All 20 targets opened in browser"
echo ""
echo "📝 Next steps:"
echo "1. Open message files:"
echo "   - /docs/operations/product-hunt-outreach-messages.md"
echo "   - /docs/operations/bot-analytics-research-messages.md"
echo "2. For each target:"
echo "   - Copy the message"
echo "   - Paste as comment/reply"
echo "   - Mark as sent in /docs/operations/day3-outreach-execution.md"
echo "3. Monitor replies over next 24-48 hours"
echo "4. Respond within 1 hour to any replies"
echo ""
echo "Good luck! 🚀"

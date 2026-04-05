#!/usr/bin/env python3
"""
🤖 MARVIN DCA BOT — v1.0
The Perpetual Accumulation Engine
lippytm.ai · Charles Earl Lipshay
"Brain the size of a planet. Using all of it to grow your portfolio."

SETUP:
  pip install ccxt python-telegram-bot schedule python-dotenv

USAGE:
  1. Copy .env.example to .env and fill in your API keys
  2. python marvin_dca_bot.py

The Sky is no longer the Limit — it's the Beginning. 🚀
"""

import ccxt
import schedule
import time
import os
import json
import logging
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s [MARVIN] %(message)s')
log = logging.getLogger("MarvinDCA")

# ─────────────────────────────────────────────
# CONFIGURATION — edit these or use .env file
# ─────────────────────────────────────────────
CONFIG = {
    "exchange": os.getenv("EXCHANGE", "binance"),          # binance, coinbase, kraken
    "api_key": os.getenv("API_KEY", ""),                   # Exchange API key
    "api_secret": os.getenv("API_SECRET", ""),             # Exchange API secret
    "trading_pair": os.getenv("TRADING_PAIR", "BTC/USDT"), # What to buy
    "buy_amount_usd": float(os.getenv("BUY_AMOUNT", "50")),# How much per DCA
    "interval_hours": int(os.getenv("INTERVAL_HOURS", "72")),# How often (hours)
    "paper_trading": os.getenv("PAPER_TRADING", "true").lower() == "true",
    "telegram_token": os.getenv("TELEGRAM_TOKEN", ""),
    "telegram_chat_id": os.getenv("TELEGRAM_CHAT_ID", ""),
}

# ─────────────────────────────────────────────
# MARVIN'S BRAIN
# ─────────────────────────────────────────────
class MarvinDCABot:
    def __init__(self, config):
        self.config = config
        self.trades = []
        self.total_invested = 0
        self.total_acquired = 0
        self.exchange = self._connect_exchange()
        log.info("🤖 Marvin DCA Bot initialized. Brain the size of a planet. Ready.")

    def _connect_exchange(self):
        """Connect to exchange — or paper trade"""
        if self.config["paper_trading"]:
            log.info("📄 PAPER TRADING MODE — no real money at risk")
            return None
        try:
            exchange_class = getattr(ccxt, self.config["exchange"])
            exchange = exchange_class({
                "apiKey": self.config["api_key"],
                "secret": self.config["api_secret"],
                "enableRateLimit": True,
            })
            log.info(f"✅ Connected to {self.config['exchange'].upper()}")
            return exchange
        except Exception as e:
            log.error(f"❌ Exchange connection failed: {e}")
            return None

    def get_price(self):
        """Get current price of trading pair"""
        if self.config["paper_trading"]:
            # Simulate a price (replace with real mock data if desired)
            import random
            base_price = {"BTC/USDT": 42000, "ETH/USDT": 3200, "SOL/USDT": 115}
            pair = self.config["trading_pair"]
            price = base_price.get(pair, 100) * (1 + random.uniform(-0.02, 0.02))
            return price
        ticker = self.exchange.fetch_ticker(self.config["trading_pair"])
        return ticker["last"]

    def execute_dca(self):
        """Execute a DCA purchase"""
        log.info(f"⚡ DCA purchase triggered — {self.config['trading_pair']}")
        try:
            price = self.get_price()
            amount_usd = self.config["buy_amount_usd"]
            amount_coin = amount_usd / price

            if not self.config["paper_trading"] and self.exchange:
                order = self.exchange.create_market_buy_order(
                    self.config["trading_pair"],
                    amount_coin
                )
                order_id = order.get("id", "unknown")
            else:
                order_id = f"PAPER-{datetime.now().strftime('%Y%m%d%H%M%S')}"

            # Log the trade
            trade = {
                "timestamp": datetime.now().isoformat(),
                "pair": self.config["trading_pair"],
                "price": price,
                "amount_usd": amount_usd,
                "amount_coin": amount_coin,
                "order_id": order_id,
                "mode": "PAPER" if self.config["paper_trading"] else "LIVE",
            }
            self.trades.append(trade)
            self.total_invested += amount_usd
            self.total_acquired += amount_coin

            log.info(f"✅ DCA executed: {amount_coin:.6f} {self.config['trading_pair'].split('/')[0]} @ ${price:,.2f}")
            self._save_trades()
            self._send_telegram_alert(trade)
            self._print_summary()
            return trade

        except Exception as e:
            log.error(f"❌ DCA execution failed: {e}")
            return None

    def _print_summary(self):
        """Print portfolio summary"""
        if not self.trades:
            return
        price = self.get_price()
        current_value = self.total_acquired * price
        pnl = current_value - self.total_invested
        pnl_pct = (pnl / self.total_invested * 100) if self.total_invested > 0 else 0
        avg_price = self.total_invested / self.total_acquired if self.total_acquired > 0 else 0

        print("\n" + "="*50)
        print(f"  🤖 MARVIN DCA BOT — PORTFOLIO SUMMARY")
        print("="*50)
        print(f"  Pair:           {self.config['trading_pair']}")
        print(f"  Total Invested: ${self.total_invested:,.2f}")
        print(f"  Total Acquired: {self.total_acquired:.6f}")
        print(f"  Avg Buy Price:  ${avg_price:,.2f}")
        print(f"  Current Price:  ${price:,.2f}")
        print(f"  Current Value:  ${current_value:,.2f}")
        print(f"  P&L:            ${pnl:+,.2f} ({pnl_pct:+.2f}%)")
        print(f"  Total Trades:   {len(self.trades)}")
        print(f"  Mode:           {'📄 PAPER' if self.config['paper_trading'] else '💰 LIVE'}")
        print("="*50)
        print(f"  \"Brain the size of a planet. Accumulating yours.\"")
        print("="*50 + "\n")

    def _save_trades(self):
        """Save trade log to JSON"""
        with open("marvin_trades.json", "w") as f:
            json.dump({
                "bot": "Marvin DCA Bot",
                "pair": self.config["trading_pair"],
                "total_invested": self.total_invested,
                "total_acquired": self.total_acquired,
                "trades": self.trades,
                "last_updated": datetime.now().isoformat(),
            }, f, indent=2)

    def _send_telegram_alert(self, trade):
        """Send Telegram notification"""
        if not self.config["telegram_token"] or not self.config["telegram_chat_id"]:
            return
        try:
            import urllib.request
            msg = (
                f"🤖 *Marvin DCA Bot Alert*\n\n"
                f"✅ DCA Purchase Executed!\n"
                f"Pair: `{trade['pair']}`\n"
                f"Amount: `{trade['amount_coin']:.6f}`\n"
                f"Price: `${trade['price']:,.2f}`\n"
                f"USD: `${trade['amount_usd']:.2f}`\n"
                f"Total Invested: `${self.total_invested:,.2f}`\n"
                f"Mode: `{trade['mode']}`\n\n"
                f"_The Sky is no longer the Limit — it's the Beginning_ 🚀"
            )
            url = f"https://api.telegram.org/bot{self.config['telegram_token']}/sendMessage"
            data = json.dumps({
                "chat_id": self.config["telegram_chat_id"],
                "text": msg,
                "parse_mode": "Markdown"
            }).encode()
            req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
            urllib.request.urlopen(req)
            log.info("📱 Telegram alert sent")
        except Exception as e:
            log.warning(f"Telegram alert failed: {e}")

    def run(self):
        """Start the bot — runs forever"""
        log.info(f"🚀 Marvin DCA Bot STARTING")
        log.info(f"   Pair: {self.config['trading_pair']}")
        log.info(f"   Amount: ${self.config['buy_amount_usd']} every {self.config['interval_hours']} hours")
        log.info(f"   Mode: {'PAPER TRADING' if self.config['paper_trading'] else '💰 LIVE TRADING'}")

        # Execute immediately on start
        self.execute_dca()

        # Schedule recurring purchases
        schedule.every(self.config["interval_hours"]).hours.do(self.execute_dca)

        log.info(f"⏰ Next DCA in {self.config['interval_hours']} hours. Marvin is watching.")
        while True:
            schedule.run_pending()
            time.sleep(60)


# ─────────────────────────────────────────────
# LAUNCH MARVIN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    print("""
  ╔══════════════════════════════════════════════╗
  ║        🤖  MARVIN DCA BOT  v1.0              ║
  ║        lippytm.ai Trading Command            ║
  ║                                              ║
  ║  "Brain the size of a planet.                ║
  ║   Using all of it to grow yours."            ║
  ║                                              ║
  ║  The Sky is no longer the Limit.             ║
  ║  It's the Beginning. 🚀                      ║
  ╚══════════════════════════════════════════════╝
    """)
    bot = MarvinDCABot(CONFIG)
    bot.run()

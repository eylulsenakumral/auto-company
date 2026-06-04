# Telegram Notion Bot - Implementation Notes

## Day 1-2: Bot Skeleton Complete

### Proje Yapısı

\`\`\`
projects/telegram-notion-bot/
├── src/
│   ├── bot.ts          # Ana bot mantığı, komutlar
│   └── index.ts        # Entry point, startup
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
\`\`\`

### Teknoloji Seçimleri

**grammy Framework Sebepleri:**
1. **Type-safe**: TypeScript native, full type support
2. **Modern**: Async/await native, promise-based
3. **Lightweight**: Başlangıç için minimal complexity
4. **Middleware**: Session, autoRetry ready
5. **Community**: Aktif geliştirme, iyi dokümantasyon

**Alternatifler Neden Reddedildi:**
- *telegraf*: Daha büyük, daha kurumsal, grammy kadar TypeScript-friendly değil
- *node-telegram-bot-api*: Callback soup, no native session support
- *botfather*: Fazla magic, learning curve yüksek

### Implemente Edilen Komutlar

#### /start
- Karşılama mesajı (Markdown format)
- Session initialization (userId)
- Değer props: şablon types, ödeme method vurgusu

#### /help
- Komut listesi
- Şablon satın alma flow (4 adım)
- Destek iletişim (@tolgabrk)

#### /templates
- Placeholder - "yakında" mesajı
- Day 3-5'te gerçek şablon listesi gelecek

### Error Handling

\`\`\`typescript
bot.catch((err) => {
  console.error('Bot error:', err);
  
  if (err instanceof GrammyError) {
    console.error('Request failed:', err.description);
  } else {
    console.error('Unknown error:', err);
  }
});
\`\`\`

**Pattern**: Grammy error tipine göre spesifik logging. Production'da Sentry/Logflare entegrasyonu düşünülebilir.

### Session Management

\`\`\`typescript
interface SessionData {
  userId: number;
  step?: string;        // Flow step tracking
  data?: Record<string, unknown>;  // Temp data
}
\`\`\`

**Kullanım senaryoları:**
- \`step\`: Ödeme flow'u ilerleme tracking
- \`data\`: Seçilen şablon ID, geçici user input

### Type Safety

\`\`\`typescript
type AppContext = BotContext<SessionData>;
\`\`\`

**Fayda**: \`ctx.session.userId\` her zaman type-checked, runtime error riski minimal.

### Environment Variables

\`\`\`bash
TELEGRAM_BOT_TOKEN=required
\`\`\`

**Production'da eklenmesi gerekenler:**
- \`DATABASE_URL\`: SQLite path
- \`NOTION_API_KEY\`: Şablon linkleri için
- \`LOG_LEVEL\`: debug/info/error

### Graceful Shutdown

\`\`\`typescript
process.on('SIGINT', () => {
  console.log('\\n🛑 Bot durduruluyor...');
  bot.stop();
  process.exit(0);
});
\`\`\`

**Deployment için critical**: Railway gibi platformlarda container stop signal'leri proper handle etmeli.

### Package Scripts

\`\`\`json
{
  "dev": "tsx src/index.ts",      // Hot reload, TypeScript JIT
  "build": "tsc",                 // Production build
  "start": "node dist/index.js"   // Production run
}
\`\`\`

### Next Steps (Day 3-5)

1. **Şablon Veritabanı**: SQLite schema design
2. **Telegram Stars Entegrasyonu**: Invoice payment flow
3. **Webhook Setup**: Railway deployment + webhook URL
4. **Mock Testing**: Local test ortamı

### Technical Debt List

- [ ] Logging layer (winston/pino)
- [ ] Error monitoring (Sentry)
- [ ] Health check endpoint
- [ ] Metrics collection
- [ ] Unit test framework (Jest)

### Production Checklist

- [ ] Telegram webhook URL (Railway domain)
- [ ] Environment variables set
- [ ] Database migrations ready
- [ ] Error tracking configured
- [ ] Log aggregation setup
- [ ] Health monitoring (UptimeRobot)

## Notes

1. **Her şey ship edilebilir durumda** - bot şu anda çalışır, token ile deploy edilebilir.
2. **Basitlik korundu** - unnecessary abstractions yok.
3. **Type safety yüksek** - grammy + TypeScript combo.
4. **Next adım net** - şablon DB + Stars payment.

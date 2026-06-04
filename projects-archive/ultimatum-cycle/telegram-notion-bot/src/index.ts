import bot from './bot';
import { OrdersDatabase } from './database';

console.log('🤖 Telegram Notion Bot başlatılıyor...');

const db = new OrdersDatabase();
console.log('✅ Veritabanı hazır');

bot.api.setMyCommands([
  { command: 'start', description: 'Botu başlat ve karşılama mesajını gör' },
  { command: 'templates', description: 'Mevcut Notion şablonlarını listele' },
  { command: 'myorders', description: 'Satın aldığım şablonları gör' },
  { command: 'help', description: 'Yardım rehberini göster' },
]);

bot.start({
  onStart: () => {
    console.log('✅ Bot başarıyla başlatıldı ve polling modunda çalışıyor.');
  },
}).catch((err) => {
  console.error('❌ Bot başlatılamadı:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Bot durduruluyor...');
  db.close();
  bot.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Bot durduruluyor...');
  db.close();
  bot.stop();
  process.exit(0);
});

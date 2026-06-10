import { AppDataSource } from '../data-source';
import { runSeeders } from 'typeorm-extension';

async function run() {
  try {
    console.log('🚀 Inicializando conexão com o banco de dados do Docker...');
    await AppDataSource.initialize();
    console.log('✅ Conectado com sucesso! Rodando os Seeders...');

    await runSeeders(AppDataSource);

    console.log('🏁 Todos os seeds foram executados com sucesso!');
  } catch (error) {
    console.error('❌ Falha crítica ao rodar o seed:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
}

run();
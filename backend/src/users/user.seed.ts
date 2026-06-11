import { DataSource } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';

export default class UserSeeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);
    const adminEmail = 'admin@email.com';

    console.log('Verificando se o usuário Admin já existe no banco...');
    
    const adminExists = await repository.findOneBy({ email: adminEmail });

    if (!adminExists) {
      console.log('Gerando hash seguro para a nova senha...');
      const hashedPassword = await bcrypt.hash('padraosenhaadmin', 10);

      console.log('Criando o novo usuário Administrador Padrão...');
      await repository.insert({
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword, 
        role: UserRole.ADMIN,
      });

      console.log('Tudo pronto! Usuário admin criado com sucesso.');
    } else {
      console.log('Usuário admin já existe no banco. Pulando criação para não duplicar.');
    }
  }
}
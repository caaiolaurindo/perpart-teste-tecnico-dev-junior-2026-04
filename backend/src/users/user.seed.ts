import { DataSource } from 'typeorm';
import { User, UserRole } from './user.entity';

export default class UserSeeder {
  public async run(
    dataSource: DataSource
  ): Promise<any> {
    const repository = dataSource.getRepository(User);

    const adminExists = await repository.findOneBy({ email: 'admin@email.com' });

    if (!adminExists) {

      await repository.insert({
        name: 'Administrador',
        email: 'admin@email.com',
        password: 'padraosenhaadmin',
        role: UserRole.ADMIN,
      });
    }
  }
}
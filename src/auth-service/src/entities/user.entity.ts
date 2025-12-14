import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    picture: string;

    @Column()
    provider: string; // 'google' o 'twitter'

    @Column({ unique: true })
    providerId: string;

    @Column('simple-array', { default: '' })
    favorites: string[]; // Array de IDs de Wikidata (ej: ['Q113900920', 'Q123456'])

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}

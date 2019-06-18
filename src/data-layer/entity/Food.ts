import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class Food {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 150,
        unique: true
    })
    name: string;

    @Column('double')
    price: number

    @Column('text')
    type: FoodType;
}

export interface IFood {
    id?: number;
    name: string;
    price: number;
    type: FoodType;
}

export enum FoodType {
    Starch = 'Starch',
    Vitamin = 'Vitamin',
    Protein = 'Protein',
    Drink = 'Drink',
    Other = 'Other'
}

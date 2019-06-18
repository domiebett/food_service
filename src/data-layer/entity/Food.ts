import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Meal } from './Meal';

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

    @ManyToMany(type => Meal, meal => meal.foods)
    meals: Meal[];
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

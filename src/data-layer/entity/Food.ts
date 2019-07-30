import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, BeforeInsert } from 'typeorm';
import { IsIn } from 'class-validator';
import { Meal } from './Meal';


export enum FoodType {
    Starch = 'Starch',
    Vitamin = 'Vitamin',
    Protein = 'Protein',
    Drink = 'Drink',
    Other = 'Other'
}

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
    @IsIn(Object.values(FoodType))
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

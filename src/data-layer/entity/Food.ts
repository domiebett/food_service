import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { IsIn, MinLength } from 'class-validator';
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
    @MinLength(2)
    name: string;

    @Column('double')
    price: number

    @Column('text')
    @IsIn(Object.values(FoodType))
    type: FoodType;

    @ManyToMany(type => Meal, meal => meal.foods)
    meals: Meal[];

    @Column('integer')
    userId: number;
}

export interface IFood {
    id?: number;
    name: string;
    price: number;
    type: FoodType;
}

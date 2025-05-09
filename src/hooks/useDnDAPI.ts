import { useState, useEffect } from 'react';

const BASE_URL = 'https://www.dnd5eapi.co/api';

export interface Spell {
    index: string;
    name: string;
    desc: string[];
    higher_level?: string[];
    range: string;
    components: string[];
    material?: string;
    ritual: boolean;
    duration: string;
    concentration: boolean;
    casting_time: string;
    level: number;
    school: {
        name: string;
    };
    classes: {
        name: string;
    }[];
}

export const useDnDAPI = () => {
    const fetchSpells = async () => {
        try {
            const response = await fetch(`${BASE_URL}/spells`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Erro ao buscar lista de magias:', error);
            return [];
        }
    };

    const fetchSpellDetails = async (index: string) => {
        try {
            const response = await fetch(`${BASE_URL}/spells/${index}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Erro ao buscar detalhes da magia ${index}:`, error);
            return null;
        }
    };

    const translateSchool = (school: string): string => {
        const schools: { [key: string]: string } = {
            'Abjuration': 'Abjuração',
            'Conjuration': 'Conjuração',
            'Divination': 'Adivinhação',
            'Enchantment': 'Encantamento',
            'Evocation': 'Evocação',
            'Illusion': 'Ilusão',
            'Necromancy': 'Necromancia',
            'Transmutation': 'Transmutação'
        };
        return schools[school] || school;
    };

    const translateClass = (className: string): string => {
        const classes: { [key: string]: string } = {
            'Bard': 'Bardo',
            'Cleric': 'Clérigo',
            'Druid': 'Druida',
            'Paladin': 'Paladino',
            'Ranger': 'Patrulheiro',
            'Sorcerer': 'Feiticeiro',
            'Warlock': 'Bruxo',
            'Wizard': 'Mago'
        };
        return classes[className] || className;
    };

    const formatSpell = (spell: any): Spell => {
        return {
            ...spell,
            school: {
                ...spell.school,
                name: translateSchool(spell.school.name)
            },
            classes: spell.classes.map((c: any) => ({
                ...c,
                name: translateClass(c.name)
            }))
        };
    };

    return {
        fetchSpells,
        fetchSpellDetails,
        formatSpell
    };
};

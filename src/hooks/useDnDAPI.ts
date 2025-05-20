import { useState, useEffect, useCallback } from 'react';

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

export interface Race {
    index: string;
    name: string;
    speed: number;
    ability_bonuses: Array<{
        ability_score: { name: string };
        bonus: number;
    }>;
    traits: Array<{
        name: string;
        description: string;
    }>;
}

export interface Class {
    index: string;
    name: string;
    hit_die: number;
    proficiencies: Array<{
        name: string;
    }>;
    saving_throws: Array<{
        name: string;
    }>;
}

export interface Background {
    index: string;
    name: string;
    feature: {
        name: string;
        description: string;
    };
    personality_traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
}

export const useDnDAPI = () => {
    const [cache, setCache] = useState<{[key: string]: any}>({});

    const fetchFromAPI = useCallback(async (endpoint: string) => {
        try {
            // Check cache first
            if (cache[endpoint]) {
                return cache[endpoint];
            }

            const response = await fetch(`${BASE_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Cache the result
            setCache(prev => ({
                ...prev,
                [endpoint]: data
            }));
            
            return data;
        } catch (error) {
            console.error(`Erro ao buscar ${endpoint}:`, error);
            throw error;
        }
    }, [cache]);

    const fetchSpells = useCallback(async () => {
        try {
            const data = await fetchFromAPI('/spells');
            return data.results;
        } catch (error) {
            console.error('Erro ao buscar lista de magias:', error);
            return [];
        }
    }, [fetchFromAPI]);

    const fetchSpellDetails = useCallback(async (index: string) => {
        try {
            return await fetchFromAPI(`/spells/${index}`);
        } catch (error) {
            console.error(`Erro ao buscar detalhes da magia ${index}:`, error);
            return null;
        }
    }, [fetchFromAPI]);

    const fetchClasses = useCallback(async () => {
        try {
            const data = await fetchFromAPI('/classes');
            const classesWithDetails = await Promise.all(
                data.results.map(async (c: any) => {
                    try {
                        const details = await fetchFromAPI(`/classes/${c.index}`);
                        return {
                            ...details,
                            name: translateClass(details.name)
                        };
                    } catch (error) {
                        console.error(`Erro ao buscar detalhes da classe ${c.index}:`, error);
                        return null;
                    }
                })
            );
            return classesWithDetails.filter(Boolean);
        } catch (error) {
            console.error('Erro ao buscar classes:', error);
            return [];
        }
    }, [fetchFromAPI]);

    const fetchRaces = useCallback(async () => {
        try {
            const data = await fetchFromAPI('/races');
            const racesWithDetails = await Promise.all(
                data.results.map(async (r: any) => {
                    try {
                        const details = await fetchFromAPI(`/races/${r.index}`);
                        return {
                            ...details,
                            name: translateRace(details.name)
                        };
                    } catch (error) {
                        console.error(`Erro ao buscar detalhes da raça ${r.index}:`, error);
                        return null;
                    }
                })
            );
            return racesWithDetails.filter(Boolean);
        } catch (error) {
            console.error('Erro ao buscar raças:', error);
            return [];
        }
    }, [fetchFromAPI]);

    const fetchBackgrounds = useCallback(async () => {
        try {
            const data = await fetchFromAPI('/backgrounds');
            const backgroundsWithDetails = await Promise.all(
                data.results.map(async (b: any) => {
                    try {
                        const details = await fetchFromAPI(`/backgrounds/${b.index}`);
                        return {
                            ...details,
                            name: translateBackground(details.name)
                        };
                    } catch (error) {
                        console.error(`Erro ao buscar detalhes do antecedente ${b.index}:`, error);
                        return null;
                    }
                })
            );
            return backgroundsWithDetails.filter(Boolean);
        } catch (error) {
            console.error('Erro ao buscar antecedentes:', error);
            return [];
        }
    }, [fetchFromAPI]);

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

    const translateRace = (race: string): string => {
        const races: { [key: string]: string } = {
            'Dragonborn': 'Draconato',
            'Dwarf': 'Anão',
            'Elf': 'Elfo',
            'Gnome': 'Gnomo',
            'Half-Elf': 'Meio-Elfo',
            'Half-Orc': 'Meio-Orc',
            'Halfling': 'Halfling',
            'Human': 'Humano',
            'Tiefling': 'Tiefling'
        };
        return races[race] || race;
    };

    const translateBackground = (background: string): string => {
        const backgrounds: { [key: string]: string } = {
            'Acolyte': 'Acólito',
            'Criminal': 'Criminoso',
            'Folk Hero': 'Herói do Povo',
            'Noble': 'Nobre',
            'Sage': 'Sábio',
            'Soldier': 'Soldado'
        };
        return backgrounds[background] || background;
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
        fetchClasses,
        fetchRaces,
        fetchBackgrounds,
        formatSpell
    };
};

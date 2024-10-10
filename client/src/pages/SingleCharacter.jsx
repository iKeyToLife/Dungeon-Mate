import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_CHARACTER_BY_ID } from '../utils/queries';
import { Button } from 'reactstrap';

const SingleCharacter = () => {
    const { characterId } = useParams();

    const { loading, error, data } = useQuery(GET_CHARACTER_BY_ID, {
        variables: { characterId },
    });

    console.log(data);

    if (loading) return <p>Loading character...</p>;
    if (error) return <p>Error fetching character: {error.message}</p>;

    const character = data?.character;

    if (!character) return <p>No character found</p>;

    const {
        name,
        race,
        gender,
        class: characterClass,
        attributes,
        proficiencies,
        inventory,
        spells,
        alignment,
        characterImg,
        bio,
    } = character;

    return (
        <div className="single-character-container">
            <h1 className="character-title">{name}</h1>

            {/* Character Image */}
            <div className="character-image-container">
                <img src={characterImg} alt={name} className="character-image" />
            </div>

            {/* Race, Gender, and Class */}
            <div className="character-info-container">
                <p><strong>Race:</strong> {race}</p>
                <p><strong>Gender:</strong> {gender}</p>
                <p><strong>Class:</strong> {characterClass.map(c => `${c.className} (Level ${c.level})`).join(', ')}</p>
                <p><strong>Alignment:</strong> {alignment}</p>
            </div>

            {/* Attributes */}
            <div className="character-attributes-container">
                <h3>Attributes</h3>
                <p><strong>Strength:</strong> {attributes.strength}</p>
                <p><strong>Dexterity:</strong> {attributes.dexterity}</p>
                <p><strong>Constitution:</strong> {attributes.constitution}</p>
                <p><strong>Intelligence:</strong> {attributes.intelligence}</p>
                <p><strong>Wisdom:</strong> {attributes.wisdom}</p>
                <p><strong>Charisma:</strong> {attributes.charisma}</p>
                <p><strong>Hit Points:</strong> {attributes.hitPoints}</p>
                <p><strong>Armor Class:</strong> {attributes.armorClass}</p>
                <p><strong>Attack Power:</strong> {attributes.attackPower}</p>
                <p><strong>Magic Power:</strong> {attributes.magicPower}</p>
            </div>

            {/* Bio */}
            {bio && (
                <div className="character-bio-container">
                    <h3>Bio</h3>
                    <p>{bio}</p>
                </div>
            )}

            {/* Proficiencies */}
            <div className="character-proficiencies-container">
                <h3>Proficiencies</h3>
                {proficiencies ? (
                    typeof proficiencies === 'string' ? (
                        <ul>
                            {proficiencies.split(',').map((prof, index) => (
                                <li key={index}>{prof} +1</li>
                            ))}
                        </ul>
                    ) : (
                        <ul>
                            {proficiencies.map((prof, index) => (
                                <li key={index}>{prof} +1</li>
                            ))}
                        </ul>
                    )
                ) : (
                    <p>No proficiencies selected</p>
                )}
            </div>

            {/* Spells */}
            <div className="character-spells-container">
                <h3>Spells</h3>
                {spells.length > 0 ? (
                    <ul>
                        {spells.map((spell, index) => (
                            <li key={index}>{spell.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No spells selected</p>
                )}
            </div>

            {/* Inventory */}
            <div className="character-inventory-container">
                <h3>Inventory</h3>
                {inventory.length > 0 ? (
                    <ul>
                        {inventory.map((item, index) => (
                            <li key={index}>{item.name} ({item.type})</li>
                        ))}
                    </ul>
                ) : (
                    <p>No inventory items selected</p>
                )}
            </div>
        </div>
    );
};

export default SingleCharacter;
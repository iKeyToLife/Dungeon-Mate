import React from 'react';

const CharacterCard = ({ character }) => {
    return (
        <div className="character-card">
            <h3>{character.name}</h3>
            <p><strong>Race:</strong> {character.race}</p>
            <p><strong>Gender:</strong> {character.gender}</p>
            <p><strong>Class:</strong> {character.class.map(cls => cls.className).join(", ")}</p>
            <p><strong>Alignment:</strong> {character.alignment}</p>
            <p><strong>Attributes:</strong></p>
            <ul>
                <li>Strength: {character.attributes.strength}</li>
                <li>Dexterity: {character.attributes.dexterity}</li>
                <li>Constitution: {character.attributes.constitution}</li>
                <li>Intelligence: {character.attributes.intelligence}</li>
                <li>Wisdom: {character.attributes.wisdom}</li>
                <li>Charisma: {character.attributes.charisma}</li>
            </ul>
            <img src={character.characterImg} alt={`${character.name} Character`} />
        </div>
    );
};

export default CharacterCard;
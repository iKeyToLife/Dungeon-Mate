import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_CHARACTER } from '../utils/mutations';
import { GET_CHARACTERS_BY_USER_ID } from '../utils/queries';

const CharacterCard = ({ character, onEdit, onDelete }) => {
    const [deleteCharacter] = useMutation(DELETE_CHARACTER, {
        refetchQueries: [{ query: GET_CHARACTERS_BY_USER_ID }],
        onCompleted: () => {
            if (onDelete) {
                onDelete(character._id);  // Call parent component's onDelete callback if provided
            }
        },
        onError: (error) => {
            console.error("Error deleting character:", error);
        }
    });

    const handleDelete = () => {
        deleteCharacter({ variables: { characterId: character._id } });
    };

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
            <div className="character-button-row">

                <button className="character-button-edit" onClick={() => onEdit(character.id)}>Edit</button>

                <button className="character-button-delete" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

export default CharacterCard;

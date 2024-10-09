import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_CAMPAIGN } from '../utils/queries';
import { useState } from 'react';

const SingleCampaign = () => {
    const navigate = useNavigate();
    const { campaignId } = useParams();
    const { data, loading, error } = useQuery(GET_CAMPAIGN, {
        variables: { campaignId },
    });
    const [expandedItems, setExpandedItems] = useState([]);
    const [creatureDetails, setCreatureDetails] = useState({});

    if (loading) return <p>Loading campaign details...</p>;
    if (error) return <p>Error loading campaign details.</p>;

    const campaign = data.campaign;

    const toggleExpand = async (type, id) => {
        setExpandedItems((prevItems) =>
            prevItems.includes(id) ? prevItems.filter((item) => item !== id) : [...prevItems, id]
        );

        if (type === 'creature' && !creatureDetails[id]) {
            try {
                const response = await fetch(`https://www.dnd5eapi.co/api/monsters/${id}`);
                const data = await response.json();
                setCreatureDetails((prevDetails) => ({
                    ...prevDetails,
                    [id]: data,
                }));
            } catch (error) {
                console.error('Error fetching creature details:', error);
            }
        }
    };

    // Reusing safeRender to handle arrays and complex objects safely
    const safeRender = (value) => {
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        return value;
    };

    return (
        <div>
            {/* Back to Campaigns Button */}
            <div className="back-button-container">
                <button className="back-button" onClick={() => navigate('/campaigns')}>
                    Back to Campaigns
                </button>
            </div>

            <div className="single-campaign-container">
                <article className="campaign-details">
                    <h1>{campaign.title}</h1>

                    <section className="campaign-section">
                        <h3>Details:</h3>
                        <p>{campaign.description}</p>
                    </section>

                    <section className="campaign-section">
                        <h3>NPCs:</h3>
                        <p>{campaign.npcs}</p>
                    </section>

                    <section className="campaign-section">
                        <h3>Notes:</h3>
                        <p>{campaign.notes}</p>
                    </section>
                </article>

                {/* Encounters */}
                <div className="single-campaign-encounters">
                    <h3>Encounters:</h3>
                    <div className="single-campaign-content">
                        {campaign.encounters.map((encounter) => (
                            <div className="item-container" key={encounter._id}>
                                <h4>{encounter.title}</h4>
                                <button
                                    className="single-campaign-button"
                                    onClick={() => toggleExpand('encounter', encounter._id)}
                                >
                                    {expandedItems.includes(encounter._id) ? 'Collapse' : 'View'}
                                </button>
                                {expandedItems.includes(encounter._id) && (
                                    <div className="expanded-details-campaign">
                                        <p><strong>Details: </strong>{' '}{encounter.details}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quests */}
                <div className="single-campaign-quests">
                    <h3>Quests:</h3>
                    <div className="single-campaign-content">
                        {campaign.quests.map((quest) => (
                            <div className="item-container" key={quest._id}>
                                <h4>{quest.title}</h4>
                                <button
                                    className="single-campaign-button"
                                    onClick={() => toggleExpand('quest', quest._id)}
                                >
                                    {expandedItems.includes(quest._id) ? 'Collapse' : 'View'}
                                </button>
                                {expandedItems.includes(quest._id) && (
                                    <div className="expanded-details-campaign">
                                        <p><strong>Details: </strong>{' '}{quest.details}</p>
                                        <p><strong>Rewards: </strong>{' '}{quest.rewards}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dungeons */}
                <div className="single-campaign-dungeons">
                    <h3>Dungeons:</h3>
                    <div className="single-campaign-content">
                        {campaign.dungeons.map((dungeon) => (
                            <div className="item-container" key={dungeon._id}>
                                <h4>{dungeon.title}</h4>
                                <button
                                    className="single-campaign-button"
                                    onClick={() => toggleExpand('dungeon', dungeon._id)}
                                >
                                    {expandedItems.includes(dungeon._id) ? 'Collapse' : 'View'}
                                </button>
                                {expandedItems.includes(dungeon._id) && (
                                    <div className="expanded-details-campaign">
                                        <p>{dungeon.description}</p>

                                        {/* Nested Encounters within the Dungeon */}
                                        <h5>Encounters:</h5>
                                        {dungeon.encounters.map((enc, index) => (
                                            <div key={index} className="expanded-details-campaign">
                                                <p><strong>Title: </strong>{' '}{enc.title}</p>
                                                <p><strong>Details: </strong>{' '}{enc.details}</p>
                                            </div>
                                        ))}

                                        {/* Nested Quests within the Dungeon */}
                                        <h5>Quests:</h5>
                                        {dungeon.quests.map((quest, index) => (
                                            <div key={index} className="expanded-details-campaign">
                                                <p><strong>Title: </strong>{' '}{quest.title}</p>
                                                <p><strong>Details: </strong>{' '}{quest.details}</p>
                                                <p><strong>Rewards: </strong>{' '}{quest.rewards}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Creatures */}
                <div className="single-campaign-creatures">
                    <h3>Creatures:</h3>
                    <div className="single-campaign-content">
                        {campaign.creatures.map((creature) => (
                            <div className="item-container" key={creature.index}>
                                <h4>{creature.name}</h4>
                                <button
                                    className="single-campaign-button"
                                    onClick={() => toggleExpand('creature', creature.index)}
                                >
                                    {expandedItems.includes(creature.index) ? 'Collapse' : 'View'}
                                </button>
                                {expandedItems.includes(creature.index) && (
                                    <div className="expanded-details-campaign">
                                        {creatureDetails[creature.index] ? (
                                            <>
                                                <p><strong>Type: </strong>{safeRender(creatureDetails[creature.index].type)}</p>
                                                <p><strong>Hit Points: </strong>{safeRender(creatureDetails[creature.index].hit_points)}</p>
                                                <p><strong>Armor Class: </strong>{typeof creatureDetails[creature.index].armor_class === 'object'
                                                    ? safeRender(creatureDetails[creature.index].armor_class.value)
                                                    : safeRender(creatureDetails[creature.index].armor_class)}</p>

                                                <p><strong>Actions:</strong></p>
                                                {Array.isArray(creatureDetails[creature.index].actions) && creatureDetails[creature.index].actions.length > 0 ? (
                                                    creatureDetails[creature.index].actions.map((action, index) => (
                                                        <p className="expanded-details-campaign" key={index}>{safeRender(action.name)}</p>
                                                    ))
                                                ) : (
                                                    <p>No actions available</p>
                                                )}

                                                {Array.isArray(creatureDetails[creature.index].special_abilities) && creatureDetails[creature.index].special_abilities.length > 0 && (
                                                    <>
                                                        <p><strong>Special Abilities:</strong></p>
                                                        {creatureDetails[creature.index].special_abilities.map((ability, index) => (
                                                            <p className="expanded-details-campaign" key={index}>{safeRender(ability.name)}</p>
                                                        ))}
                                                    </>
                                                )}

                                                {Array.isArray(creatureDetails[creature.index].legendary_actions) && creatureDetails[creature.index].legendary_actions.length > 0 && (
                                                    <>
                                                        <p><strong>Legendary Actions:</strong></p>
                                                        {creatureDetails[creature.index].legendary_actions.map((action, index) => (
                                                            <p className="expanded-details-campaign" key={index}>{safeRender(action.name)}</p>
                                                        ))}
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <p>Fetching creature details from the DnD API...</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleCampaign;
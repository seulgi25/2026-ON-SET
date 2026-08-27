import "./PreMatchCard.css";

function PreMatchCard({ card }) {
    if (!card) {
        return null;
    }

    return (
        <div className="card-item">
            <img
                src={card.image}
                alt={`${card.name} 카드`}
            />

            <div className="card-item-info">
                <h3>{card.name}</h3>

                <div className="card-keywords">
                    {card.keywords.map((keyword) => (
                        <span key={keyword}>#{keyword}</span>
                    ))}
                </div>

                <p>{card.description}</p>
            </div>
        </div>
    );
}

export default PreMatchCard;
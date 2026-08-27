import { useNavigate } from "react-router-dom";
import { preMatchCards } from "../data/cards";

function HomePreMatchSection(){
    const navigate = useNavigate();

    const getTodayCard = () => {
        const saved = localStorage.getItem("preMatchCard");

        if (!saved){
            return null;
        }

        const parsed = JSON.parse(saved);
        const today = new Date();
        const todayDate = `${today.getFullYear()}-${String(
            today.getMonth() + 1
        ).padStart(2, "0")}-${String(today.getDate()).padStart(2,"0")}`;

        if (parsed.date !== todayDate){
            return null;
        }

        return (
            preMatchCards.find(
                (card) => card.id === parsed.cardId
            ) || null
        );
    };

    const todayCard = getTodayCard();

    const goPreCard = () => {
        navigate("/cards/pre-match");
    };

    return(
        <section className="home-card">
            <div className="section-title">
                <span>*</span>
                <h2>오늘의 응원 카드</h2>
            </div>

            {todayCard ? (
                <div className="home_precard_preview">
                    <img
                        src={todayCard.image}
                        alt={`${todayCard.name} 카드`}
                    />

                    <div className="home_precard_info">
                        <span>오늘의 카드</span>
                        <h3>{todayCard.name}</h3>

                        <div className="home_precard_keywords">
                            {todayCard.keywords.map((keyword) => (
                                <span key={keyword}>#{keyword}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="precard_empty">
                    <p>경기 시작 전, 오늘의 응원 포인트를 한 장 뽑아보세요.</p>
                </div>
            )}

            <button
                className="secondary-button"
                onClick={goPreCard}
            >
                {todayCard ? "오늘의 카드 보기" : "오늘의 카드 뽑기"}
            </button>
        </section>
    );
}

export default HomePreMatchSection;
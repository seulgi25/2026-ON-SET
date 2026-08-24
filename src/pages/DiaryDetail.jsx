import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import "./DiaryDetail.css";

function DiaryDetail(){
    //id가져오기
    const { id } = useParams();

    //localStorage 전체 일기 불러오기
    const diaries = JSON.parse(localStorage.getItem("diaries")) || [];

    //현재 id와 같은 일기 찾기
    const diary = diaries.find(
        (diary) => String(diary.id) === id
    );

    if(!diary){
        return (
            <>
                <Header />
                <main className="diarydetail">
                    <p>해당 경기 기록을 찾을 수 없습니다.</p>
                    <Link to ="/archive">
                        아카이브로 돌아가기
                    </Link>
                </main>
            </>
        );
    }

    const findPlayer = (playerId) => {
        return diary.entry?.find((player) => player.id === playerId);
    }

    const liberoPlayer = findPlayer(diary.startingLineup?.libero);

    return(
        <>
            <Header />
            <main className="diarydetail">
                {/*목록으로 돌아가기*/}
                <Link to="/archive" className="back_link">
                    아카이브로 돌아가기
                </Link>

                {/*경기 기본 정보*/}
                <section className = "detail_match">
                    <div className="detail_top">
                        <span className="detail_date">{diary.date}</span>
                        
                        <span className="detail_type">
                            {diary.viewingType}
                        </span>
                    </div>

                    <div className="detail_score">
                        <strong className="detail_team">{diary.myTeam}</strong>
                        
                        <div className="score_center">
                            <span>
                                {diary.myScore} : {diary.opponentScore}
                            </span>

                            <p className={
                                diary.result === "승리" ? "detail_result result_win" : "detail_result result_lose"}>
                                    {diary.result}
                                </p>
                        </div>

                        <strong className="detail_team">{diary.opponent}</strong>
                    </div>
                </section>
                
                {/*경기 엔트리*/}
                {diary.entry?.length > 0 && (
                    <section className="detail_entry">
                        <h2>경기 엔트리</h2>

                        <div className="detail_entry_list">
                            {diary.entry.map((player) => (
                                <div className="detail_entry_player" key={player.id}>
                                    <span className="detail_entry_number">{player.number}</span>
                                    <p>{player.name}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/*스타팅 라인업 */}
                {diary.startingLineup && (
                    <section className="detail_starting">
                        <h2>스타팅 라인업</h2>

                        <div className="detail_starting_list">
                            {[4, 3, 2, 5, 6, 1].map((position) => {
                                const player = findPlayer(
                                    diary.startingLineup[`position${position}`]
                                );

                                return(
                                    <div className="detail_starting_player" key={position}>
                                        <p>{player?.name}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="detail_libero">
                            <p>{liberoPlayer?.name}</p>
                        </div>
                    </section>
                )}

                {/*선수 교체*/}
                {diary.substitutions?.length > 0 && (
                    <section className="detail_substitutions">
                        <h2>선수 교체</h2>

                        <div className="detail_substitution_list">
                            {diary.substitutions.map((substitution) => {
                                const outPlayer = findPlayer(substitution.outPlayer);
                                const inPlayer = findPlayer(substitution.inPlayer);

                                return(
                                    <div
                                        className="detail_substitution"
                                        key={substitution.id}
                                    >
                                        <span>
                                            {substitution.set}세트 -{" "}
                                            {substitution.myScore} :{" "}
                                            {substitution.opponentScore}
                                        </span>

                                        <p>
                                            {outPlayer?.name}
                                            {" → "}
                                            {inPlayer?.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/*세트별 흐름*/}
                {diary.setFlow?.length > 0 &&(
                    <section className="detail_setflow">
                        <h2>세트별 흐름</h2>

                        <div className="detail_setflow_list">
                            {diary.setFlow.map((set) => (
                                <div className="detail_setflow_item" key={set.set}>
                                    <div className="detail_setflow_top">
                                        <span>{set.set}세트</span>

                                        <strong>
                                            {set.myScore} : {set.opponentScore}
                                        </strong>
                                    </div>

                                    {set.memo && (
                                        <p>{set.memo}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/*경기 일기와 기록*/}
                <section className="detail_grid">
                    <div className="detail_main">
                        <h1>경기 일기</h1>

                        <p className="detail_diary">
                            {diary.content || "작성한 경기 일기가 없습니다."}
                        </p>
                    </div>

                    <aside className="detail_side">
                        <h2>오늘의 기록</h2>
                        <div className="detail_item">
                            <span>오늘의 감정</span>
                            <p>
                                {diary.emotion || "기록 없음"}
                            </p>
                        </div>

                        <div className="detail_item">
                            <span>오늘의 선수</span>
                            <p>
                                {diary.player || "기록 없음"}
                            </p>
                        </div>

                        <div className="detail_item">
                            <span>기억에 남는 장면</span>
                            <p>{diary.moment || "기록 없음"}</p>
                        </div>
                    </aside>
                </section>
            </main>
        </>
    );
}

export default DiaryDetail;
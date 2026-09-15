import { useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import "./DiaryWrite.css";

//팀선택
const teams = [
    "현대캐피탈",
    "대한항공",
    "한국전력",
    "우리카드",
    "KB손해보험",
    "OK저축은행",
    "삼성화재"
];

//감정선택목록
const emotions=[
    "짜릿해요",
    "행복해요",
    "감동",
    "긴장",
    "아쉬워요",
    "슬퍼요",
    "해체해라",
];

//포지션
const positions = [
    "세터",
    "아웃사이드히터",
    "아포짓스파이커",
    "미들블로커",
    "리베로",
];

const courtPositions = [4,3,2,5,6,1];

const createEmptyDiary = () => ({
    //기본 정보
    date: "",
    myTeam:"",
    opponent: "",
    viewingType: "",
    result: "",
    myScore: "",
    opponentScore: "",

    //상세 정보
    entry: [],
    startingLineup: {
        position1: "",
        position2: "",
        position3: "",
        position4: "",
        position5: "",
        position6: "",
        libero: ""
    },
    substitutions: [],
    setFlow: [],

    //감정 기록
    emotion: "",
    player: "",
    momentSet: "",
    moment: "",
    content: "",
});

function DiaryWrite(){
    const { id } = useParams();
    const isEditMode = Boolean(id);
    //경기 일기 입력값
    const [diary, setDiary] = useState(() => {
        const emptyDiary = createEmptyDiary();

        if (!isEditMode) {
            return emptyDiary;
        }

        const savedDiaries = JSON.parse(localStorage.getItem("diaries")) || [];
        
        const savedDiary = savedDiaries.find(
            (diary) => String(diary.id) === id
        );

        if (!savedDiary){
            return emptyDiary;
        }

        return {
            ...emptyDiary,
            ...savedDiary,

            startingLineup: {
                ...emptyDiary.startingLineup,
                ...(savedDiary.startingLineup || {}),
            },

            entry: savedDiary.entry || [],
            substitutions: savedDiary.substitutions || [],
            setFlow: savedDiary.setFlow || [],
            momentSet: savedDiary.momentSet || "",
        };
    });

    const navigate = useNavigate();

    const myMatchScore = Number(diary.myScore);
    const opponentMatchScore = Number(diary.opponentScore);

    const hasValidFinalScore =
        diary.myScore !== "" &&
        diary.opponentScore !== "" &&
        (
            (myMatchScore === 3 && opponentMatchScore >= 0 && opponentMatchScore <= 2) ||
            (opponentMatchScore === 3 && myMatchScore >= 0 && myMatchScore <= 2)
        );

    //input, select, textarea 변경
    const handleChange=(e) => {
        const { name, value } = e.target;

        setDiary((prev) => {
            const updatedDiary = {
                ...prev,
                [name]: value,
            };

            //세트 수 계산
            if (name === "myScore" || name==="opponentScore"){
                const myScore = Number(updatedDiary.myScore);
                const opponentScore = Number(updatedDiary.opponentScore);

                const hasValidScore =
                    updatedDiary.myScore !== "" && updatedDiary.opponentScore !== "" &&
                    (
                        (myScore === 3 && opponentScore >= 0 && opponentScore <= 2) ||
                        (opponentScore === 3 && myScore >= 0 && myScore <= 2)
                    );

                if (hasValidScore) {
                    const totalSets = myScore + opponentScore;
                    updatedDiary.setFlow = Array.from(
                        {length: totalSets},
                        (_, index) =>
                            prev.setFlow[index] || {
                                set: index + 1,
                                myScore: "",
                                opponentScore: "",
                                memo: "",
                            }
                    );
                } else {
                    updatedDiary.setFlow = [];
                }
            }
            return updatedDiary;
        })
    };

    //엔트리 입력
    const addEntryPlayer = () => {
        setDiary((prev) => ({
            ...prev,
            entry: [
                ...prev.entry,
                {
                    id: crypto.randomUUID(),
                    number:"",
                    name:"",
                    position:"",
                }
            ],
        }));
    };

    //엔트리 변경
    const handleEntryChange = (index, field, value) => {
        setDiary((prev) => ({
            ...prev,
            entry: prev.entry.map((player, i) =>
                i === index ? {...player, [field]: value,} : player
            ),
        }));
    };

    const removeEntryPlayer = (index) => {
        setDiary((prev) => {
            const deletedPlayerId = prev.entry[index]?.id;

            if (!deletedPlayerId){
                return prev;
            }

            return {
                ...prev,

                entry: prev.entry.filter(
                    (_,i)=> i !== index
                ),

                startingLineup: Object.fromEntries(
                    Object.entries(prev.startingLineup).map(
                        ([position, playerId]) => [
                            position,
                            playerId === deletedPlayerId ? "" : playerId,
                        ]
                    )
                ),

                substitutions: prev.substitutions.filter(
                    (substitution) =>
                        substitution.outPlayer !== deletedPlayerId && substitution.inPlayer !== deletedPlayerId
                ),
            };

        });
    };

    //스타팅라인업
    const handleStartingLineupChange = (position, playerId) => {
        setDiary((prev) => ({
            ...prev,
            startingLineup: {
                ...prev.startingLineup,
                [position]: playerId,
            },
        }));
    };

    //선수 교체
    const addSubstitution = () => {
        setDiary((prev) => ({
            ...prev,
            substitutions: [
                ...prev.substitutions,
                {
                    id: crypto.randomUUID(),
                    set:"",
                    outPlayer:"",
                    inPlayer:"",
                    myScore:"",
                    opponentScore:"",
                },
            ],
        }));
    };

    //선수 교체 기록 변경
    const handleSubstitutionChange = (index, field, value) => {
        setDiary((prev) => ({
            ...prev,
            substitutions: prev.substitutions.map((substitution, i) =>
                i === index ? {...substitution, [field]: value,} : substitution
            ),
        }));
    };

    //선수 교체 삭제
    const removeSubstitution = (index) => {
        setDiary((prev) => ({
            ...prev,
            substitutions: prev.substitutions.filter(
                (_,i)=> i !== index
            ),
        }));
    };

    const getAvailablePlayers = (currentPosition) => {
        const selectedPlayerIds = Object.entries(diary.startingLineup)
            .filter(([position]) => position !== currentPosition)
            .map(([,playerId]) => playerId)
            .filter(Boolean);
        
        return diary.entry.filter(
            (player) =>
                player.name.trim() !== "" && !selectedPlayerIds.includes(player.id)
        );
    };

    const handleSetFlowChange = (index, field, value) => {
        setDiary((prev) => ({
            ...prev,
            setFlow: prev.setFlow.map((setData, i) =>
            i === index ? {
            ...setData,
            [field]: value,
            }
            : setData
            ),
        }));
    };

    //경기 일기 저장 (console)
    const handleSubmit = (e) => {
        e.preventDefault();
        
        //기존 저장된 경기 일기 불러오기
        const savedDiaries = JSON.parse(localStorage.getItem("diaries")) || [];
        
        let updatedDiaries;

        if (isEditMode){
            updatedDiaries = savedDiaries.map((savedDiary) =>
                String(savedDiary.id) === id ?{
                    ...diary, id: savedDiary.id,
                    createdAt: savedDiary.createdAt,
                    updatedAt: new Date().toISOString(),
                } : savedDiary
            );
        } else {
            const newDiary = {
                ...diary,
                id: Date.now(),
                createdAt: new Date().toISOString(),
            };

            updatedDiaries = {
                ...savedDiaries,
                newDiary,
            };
        }

        //localStroage
        localStorage.setItem("diaries", JSON.stringify(updatedDiaries));

        //저장 후 아카이브 페이지로 이동
        navigate("/archive");
    };

    return (
        <>
            <Header/>

            <main className="diarywrite">
                {/*제목*/}
                <div className="diarywrite_header">
                    <h1>{isEditMode ? "경기 일기 수정" : "경기 일기 작성"}</h1>
                    <p>
                        {isEditMode ? "기록한 경기의 내용을 수정해보세요." : "오늘 본 경기의 기억과 감정을 남겨보세요."}
                    </p>
                </div>

                {/*경기 일기 입력*/}
                <form className="diarywrite_form" onSubmit={handleSubmit}>
                    {/*1.경기 기본 정보 */}
                    <section className="diarywrite_section">
                        <h2>경기 정보</h2>

                        <div className="form_grid">
                            <div className="form_group">
                                <label htmlFor="date">
                                    경기 날짜
                                </label>

                                <input id="date" type="date" name="date" value={diary.date} onChange={handleChange}/>
                            </div>

                            {/*응원팀*/}
                            <div className="form_group">
                                <label htmlFor="myTeam">
                                    응원 팀
                                </label>

                                <select id="myTeam" name="myTeam" value={diary.myTeam} onChange={handleChange}>
                                    <option value="">
                                        팀을 선택해주세요
                                    </option>

                                    {teams.map((team) => (
                                        <option key={team} value={team}>
                                            {team}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/*상대팀*/}
                            <div className="form_group">
                                <label htmlFor="opponent">
                                    상대 팀
                                </label>

                                <select id="opponent" name="opponent" value={diary.opponent} onChange={handleChange}>
                                    <option value="">
                                        팀을 선택해주세요
                                    </option>
                                    {teams.map((team) => (
                                        <option key={team} value={team}>
                                            {team}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/*관람방식*/}
                            <div className="form_group">
                                <label>관람 방식</label>

                                <div className="button_group">
                                    <button 
                                    type="button"
                                    className={
                                        diary.viewingType === "직관" ? "select_button active" : "select_button"
                                    }
                                    onClick={() =>
                                        setDiary({
                                            ...diary,
                                            viewingType: "직관",
                                        })
                                    }>직관</button>

                                    <button
                                        type="button"
                                        className={
                                            diary.viewingType === "집관" ? "select_button active" : "select_button"
                                        }
                                        onClick={()=>
                                            setDiary({
                                                ...diary,
                                                viewingType: "집관",
                                            })
                                        }
                                    >집관</button>
                                </div>
                            </div>

                            {/*경기결과*/}
                            <div className="form_group">
                                <label>경기 결과</label>

                                <div className="button_group">
                                    <button
                                        type="button"
                                        className={
                                            diary.result==="승리" ? "select_button active" : "select_button"
                                        }
                                        onClick = {() =>
                                            setDiary({
                                                ...diary,
                                                result: "승리",
                                            })
                                        }
                                    >승리</button>

                                    <button
                                        type="button"
                                        className={
                                            diary.result==="패배" ? "select_button active" : "select_button"
                                        }
                                        onClick = {() =>
                                            setDiary({
                                                ...diary,
                                                result: "패배",
                                            })
                                        }
                                    >패배</button>
                                </div>
                            </div>

                            {/*최종스코어*/}
                            <div className="form_group">
                                <label>최종 스코어</label>

                                <div className="score_input">
                                    <input
                                        type="number"
                                        name="myScore"
                                        min="0"
                                        max="3"
                                        placeholder="0"
                                        value={diary.myScore}
                                        onChange={handleChange}
                                    />

                                    <span>:</span>

                                    <input
                                        type="number"
                                        name="opponentScore"
                                        min="0"
                                        max="3"
                                        placeholder="0"
                                        value={diary.opponentScore}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <section className="diarywrite_section">
                        <h2>경기 상세 기록</h2>

                        {/*엔트리*/}
                        <div className="form_group">
                            <label>엔트리</label>

                            <div className="entry_list">
                                {diary.entry.map((player, index) => (
                                    <div className="entry_item" key={index}>
                                        <input
                                            type="number"
                                            className="entry_number"
                                            placeholder="등번호"
                                            min="1"
                                            value={player.number}
                                            onChange={(e) => handleEntryChange(index, "number" ,e.target.value)
                                            }
                                        />

                                        <input
                                            type="text"
                                            className="entry_name"
                                            placeholder="선수 이름"
                                            value={player.name}
                                            onChange={(e)=>
                                                handleEntryChange(
                                                    index,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <select
                                            className="entry_position"
                                            value={player.position}
                                            onChange={(e) => handleEntryChange(
                                                index,
                                                "position",
                                                e.target.value
                                            )}
                                        >
                                            <option value="">포지션 선택</option>

                                            {positions.map((position) => (
                                                <option key={position} value={position}>
                                                    {position}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            type="button"
                                            className="entry_remove"
                                            onClick={()=>removeEntryPlayer(index)}
                                        >삭제</button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="entry_add"
                                onClick={addEntryPlayer}
                            > + 선수 추가 </button>
                        </div>
                        
                        {/*스타팅 라인업*/}
                        <div className = "form_group lineup_group">
                            <label>스타팅 라인업</label>
                            <p className="lineup_description">
                                스타팅라인업을 구성해주세요.
                            </p>
                            
                            <div className="lineup_court">
                                {courtPositions.map((position) => (
                                    <div className={`lineup_position position${position}`} key={position}>
                                    <span className="position_number">{position}</span>

                                    <select
                                        className={
                                            diary.startingLineup[`position${position}`]
                                            ? "lineup_select selected"
                                            : "lineup_select"
                                        }
                                        value={diary.startingLineup[`position${position}`]}
                                        onChange={(e) =>
                                            handleStartingLineupChange(
                                                `position${position}`,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">선수 선택</option>

                                        {getAvailablePlayers(`position${position}`)
                                            .map((player)=> (
                                                <option key={player.id} value={player.id}>
                                                    {player.number} {player.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            ))}
                        </div>

                        {/*리베로*/}
                        <div className="lineup_libero">
                            <span className="position_number">L</span>

                            <select
                                className={
                                    diary.startingLineup.libero
                                    ?"lineup_select selected"
                                    :"lineup_select"
                                }
                                value={diary.startingLineup.libero}
                                onChange={(e)=>
                                    handleStartingLineupChange(
                                        "libero",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">리베로 선택</option>

                                {getAvailablePlayers("libero").map((player) => (
                                    <option key={player.id} value={player.id}>
                                        {player.number} {player.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/*선수 교체*/}
                        <div className="form_group substitution_group">
                            <label>선수 교체</label>
                            <p className="substitution_description">
                                선수 교체를 기록해주세요.
                            </p>
                            <div className="substitution_list">
                                {diary.substitutions.map((substitution, index) => (
                                    <div className="substitution_item" key={substitution.id}>
                                    {/*세트*/}
                                    <select
                                        className="substitution_set"
                                        value={substitution.set}
                                        onChange={(e) =>
                                            handleSubstitutionChange(
                                                index,
                                                "set",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">세트</option>
                                        <option value="1">1세트</option>
                                        <option value="2">2세트</option>
                                        <option value="3">3세트</option>
                                        <option value="4">4세트</option>
                                        <option value="5">5세트</option>
                                    </select>

                                    {/*out*/}
                                    <select
                                        value={substitution.outPlayer}
                                        onChange={(e)=>
                                            handleSubstitutionChange(
                                                index,
                                                "outPlayer",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">OUT</option>
                                        {diary.entry
                                            .filter((player) => player.name.trim() !== "")
                                            .filter(
                                                (player) => player.id !== substitution.inPlayer
                                            )
                                            .map((player)=>(
                                                <option key={player.id} value={player.id}>
                                                    {player.number} {player.name}
                                                </option>
                                            ))
                                        }
                                    </select>

                                    <span className="substitution_arrow">→</span>

                                    {/*in*/}
                                    <select
                                        value={substitution.inPlayer}
                                        onChange={(e) =>
                                            handleSubstitutionChange(
                                                index,
                                                "inPlayer",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">IN</option>
                                        {diary.entry
                                            .filter((player) => player.name.trim() !== "")
                                            .filter(
                                                (player) => player.id !== substitution.outPlayer
                                            )
                                            .map((player) => (
                                                <option key={player.id} value={player.id}>
                                                    {player.number} {player.name}
                                                </option>
                                            ))
                                        }
                                    </select>

                                    {/*교체 스코어*/}
                                    <div className="substitution_score">
                                        <span className="substitution_score_title">스코어</span>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                value={substitution.myScore}
                                                onChange={(e)=>
                                                    handleSubstitutionChange(
                                                        index,
                                                        "myScore",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <span className="score_colon">:</span>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                value={substitution.opponentScore}
                                                onChange={(e)=>
                                                    handleSubstitutionChange(
                                                        index,
                                                        "opponentScore",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                    <button type="button" className="substitution_remove"
                                        onClick={()=>removeSubstitution(index)}>
                                            삭제
                                    </button>
                                </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="substitution_add"
                                onClick={addSubstitution}
                            >+교체 기록 추가</button>
                        </div>

                        {/*세트별 흐름*/}
                        <div className="form_group setflow_group">
                            <label>세트별 흐름</label>

                            <p className="setflow_description">
                                각 세트의 스코어와 내가 느낀 세트별 흐름을 기록해주세요.
                            </p>

                            {!hasValidFinalScore ? (
                                <div className="setflow_empty">
                                    최종 스코어를 먼저 입력해주세요
                                </div>
                            ) : (
                                <div className="setflow_list">
                                    {diary.setFlow.map((setData, index) => (
                                        <div className="setflow_item" key={setData.set}>
                                            <div className="setflow_header">
                                                <span className="setflow_set">
                                                    {setData.set}세트
                                                </span>

                                                <div className="setflow_score">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        value={setData.myScore}
                                                        onChange={(e)=>
                                                            handleSetFlowChange(
                                                                index,
                                                                "myScore",
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    <span>:</span>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        value={setData.opponentScore}
                                                        onChange={(e)=>
                                                            handleSetFlowChange(
                                                                index,
                                                                "opponentScore",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <textarea
                                                rows="3"
                                                placeholder="이 세트에서의 흐름은 어땠나요?"
                                                value={setData.memo}
                                                onChange={(e) =>
                                                    handleSetFlowChange(
                                                        index,
                                                        "memo",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                        </div>
                    </div>
                </section>

                    {/*오늘의 기록*/}
                    <section className="diarywrite_section">
                        <h2>오늘의 기록</h2>

                        {/*감정 선택*/}
                        <div className="form_group">
                            <label>오늘의 감정</label>

                            <div className="emotion_group">
                                {emotions.map((emotion) => (
                                    <button
                                        key={emotion}
                                        type="button"
                                        className={
                                            diary.emotion === emotion ? "emotion_button active" : "emotion_button"
                                        }
                                        onClick={() =>
                                            setDiary({
                                                ...diary,
                                                emotion: emotion,
                                            })
                                        }
                                    >{emotion}</button>
                                ))}
                            </div>
                        </div>

                        {/*오늘의 선수*/}
                        <div className="form_group">
                            <label htmlFor="player">
                                오늘의 선수
                            </label>

                            <input
                                id="player"
                                type="text"
                                name="player"
                                placeholder="가장 기억에 남는 선수를 적어주세요."
                                value={diary.player}
                                onChange={handleChange}
                            />
                        </div>

                        {/*기억에 남는 장면*/}
                        <div className="form_group">
                            <label htmlFor="moment">
                                기억에 남는 장면
                            </label>

                            <div className = "moment_input">
                                <select
                                    className="moment_set"
                                    name="momentSet"
                                    value={diary.momentSet}
                                    onChange={handleChange}
                                >
                                    <option value="">세트 선택</option>
                                    <option value="1">1세트</option>
                                    <option value="2">2세트</option>
                                    <option value="3">3세트</option>
                                    <option value="4">4세트</option>
                                    <option value="5">5세트</option>
                                </select>

                                <input
                                    id = "moment"
                                    type = "text"
                                    name = "moment"
                                    placeholder="오늘 경기에서 가장 기억에 남는 순간은?"
                                    value={diary.moment}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/*경기 일기*/}
                        <div className="form_group">
                            <label htmlFor = "content">
                                경기 일기
                            </label>

                            <textarea
                                id="content"
                                name="content"
                                rows="7"
                                placeholder="오늘 경기에 대한 이야기를 자유롭게 남겨보세요"
                                value={diary.content}
                                onChange={handleChange}
                            />
                        </div>
                    </section>

                    {/*저장버튼*/}
                    <div className="save_area">
                        <button type="submit" className="save_button">
                            {isEditMode ? "수정 완료하기" : "기록 저장하기"}
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}

export default DiaryWrite;
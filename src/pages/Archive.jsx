import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import DiaryCard from "../components/DiaryCard";
import "./Archive.css";

function Archive(){
    //저장된 일기 불러오기
    const [diaries, setDiaries] = useState(() => {
        const savedDiaries = localStorage.getItem("diaries");

        if (savedDiaries) {
            return JSON.parse(savedDiaries);
        }
        return [];
    });

    const [filter, setFilter] = useState("전체");
    const filteredDiaries = diaries.filter((diary) => {
        if (filter === "전체"){
            return true;
        }
        return diary.viewingType === filter;
    });

    const handleDelete = (id) => {
        const isConfirmed = window.confirm("이 경기 기록을 삭제하시겠습니까?");
        if (!isConfirmed){
            return;
        }
        const updatedDiaries = diaries.filter(
            (diary) => diary.id !== id
        );

        localStorage.setItem(
            "diaries",
            JSON.stringify(updatedDiaries)
        );
        setDiaries(updatedDiaries);
    }

    return (
        <>
            <Header />

            <main className="archive">
                {/*페이지 제목*/}
                <div className="archive_header">
                    <h1>경기 일기 아카이브</h1>
                    <p>지금까지 기록한 경기의 순간들을 모아보세요.</p>
                </div>
                <div className="archive_filter">
                    <button className={
                        filter === "전체" ? "filter_button active" : "filter_button"}
                        onClick={() => setFilter("전체")}
                    >
                        전체
                    </button>

                    <button className={
                        filter === "직관" ? "filter_button active" : "filter_button"}
                        onClick={() => setFilter("직관")}
                    >
                        직관
                    </button>

                    <button className={
                        filter === "집관" ? "filter_button active" : "filter_button"}
                        onClick={() => setFilter("집관")}
                    >
                        집관
                    </button>
                </div>

                {/*기록 수*/}
                <div className="archive_summary">
                    <p>
                        총 <strong>{filteredDiaries.length}</strong>개의 경기 기록
                    </p>
                </div>

                {/*경기 기록 목록*/}
                <section className="archive_list">
                    {filteredDiaries.length === 0 ? (
                        <div className="archive_empty">
                            <h2>{filter === "전체" ? "아직 작성한 경기 기록이 없어요." : `${filter} 경기 기록이 없어요.`}</h2>
                            <p>첫 경기를 기록하고 나만의 아카이브를 만들어보세요.</p>
                        </div>
                    ) : (
                        filteredDiaries.map((diary) => (
                            <div className="archive_item" key={diary.id}>
                                <Link to = {`/diary/${diary.id}`}
                                    className="diary_link"
                                >
                                    <DiaryCard diary={diary} />
                                </Link>

                                <div className="archive_actions">
                                    <Link
                                        to={`/diary/edit/${diary.id}`}
                                        className="archive_edit"
                                    >
                                        수정
                                    </Link>

                                    <button
                                        type="button"
                                        className="archive_delete"
                                        onClick={() => handleDelete(diary.id)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>
        </>
    )
}

export default Archive;
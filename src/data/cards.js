import believeToss from "../assets/cards/mood/believe_toss.png";
import blueSound from "../assets/cards/mood/blue_sound.png";
import connectionRhythm from "../assets/cards/mood/connection_rhythm.png";
import defenceWall from "../assets/cards/mood/defence_wall.png";
import difficultHero from "../assets/cards/mood/difficult_hero.png";
import fanPower from "../assets/cards/mood/fan_power.png";
import finishClapping from "../assets/cards/mood/finish_clapping.png";
import fireSpiker from "../assets/cards/mood/fire_spiker.png";
import luckyServe from "../assets/cards/mood/lucky_serve.png";
import reverseMoment from "../assets/cards/mood/reverse_moment.png";

//경기 전 카드
export const preMatchCards = [
    {
        id:"pre-01",
        type: "preMatch",
        name: "난세의 영웅",
        keywords: ["반전", "에이스", "흐름 전환"],
        description: "쉽지 않은 경기일수록 흐름을 바꾸는 선수가 나타날 거예요. 오늘은 끝까지 포기하지 않는 팀의 힘을 믿어보세요.",
        image: difficultHero,
    },

    {
        id: "pre-02",
        type: "preMatch",
        name: "믿음의 토스",
        keywords: ["연결", "호흡", "팀워크"],
        description: "오늘 경기는 한 번의 화려한 공격보다 연결의 힘이 더 중요할지도 몰라요. 팀워크가 살아나는 순간을 기대해보세요.",
        image: believeToss,
    },

    {
        id:"pre-03",
        type: "preMatch",
        name: "수비의 벽",
        keywords: ["집중", "디그", "버팀"],
        description:"흐름은 공격만이 아니라 버텨내는 수비에서 시작되기도 해요. 오늘은 쉽게 무너지지 않는 집중력을 기대해보세요.",
        image: defenceWall,
    },

    {
        id: "pre-04",
        type: "preMatch",
        name: "불꽃 스파이커",
        keywords: ["공격", "폭발력", "해결사"],
        description: "막히던 흐름도 강한 한 방으로 뒤집힐 수 있어요. 오늘은 코트를 가르는 시원한 스파이크를 기대해보세요.",
        image: fireSpiker,
    },

    {
        id: "pre-05",
        type: "preMatch",
        name: "끝까지 박수",
        keywords: ["응원", "버팀", "마음"],
        description: "승패와 별개로 끝까지 응원하는 마음이 오늘의 경기를 더 특별하게 만들어줄거예요. 당신의 박수는 충분히 빛나니까요.",
        image: finishClapping,
    },

    {
        id: "pre-06",
        type: "preMatch",
        name: "팬들의 힘",
        keywords: ["설렘", "에너지", "응원"],
        description: "오늘 경기는 선수들만의 무대가 아니라 당신의 날이기도 해요. 설레는 마음으로 응원하면 더 좋은 순간을 만날 수 있을 거예요.",
        image: fanPower,
    },

    {
        id: "pre-07",
        type: "preMatch",
        name: "반전의 휘슬",
        keywords: ["역전", "긴장감", "승부처"],
        description: "오늘 경기는 마지막까지 결과를 알 수 없는 승부가 될지도 몰라요. 흔들리는 순간에도 반전의 기회를 기다려보세요.",
        image: reverseMoment,
    },

    {
        id: "pre-08",
        type: "preMatch",
        name: "연결의 리듬",
        keywords: ["조직력", "호흡", "흐름"],
        description: "한 명의 활약보다 모두의 활약이 중요한 날이에요. 선수들 사이의 팀워크와 연결에 주목해보세요.",
        image: connectionRhythm,
    },

    {
        id: "pre-09",
        type: "preMatch",
        name: "푸른 함성",
        keywords: ["열정","관중", "분위기"],
        description: "오늘은 코트 위의 플레이만큼 응원석의 열기도 중요한 날이에요. 당신의 함성이 선수들에게 큰 힘이 되어줄 거예요.",
        image: blueSound,
    },

    {
        id: "pre-10",
        type: "preMatch",
        name: "행운의 서브",
        keywords: ["시작", "기세", "자신감"],
        description: "시작이 좋은 날은 끝까지 좋은 흐름으로 이어질 가능성이 커요. 오늘은 첫 서브, 첫 득점의 기운을 기대해보세요.",
        image: luckyServe,
    },
];

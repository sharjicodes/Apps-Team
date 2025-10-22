import {card} from "./card.module.css";

export default function Card ({title,content}){

return (
    <div className="={card}">
        <h1>{title}</h1>
        <p>{content}</p>
    </div>
);
}
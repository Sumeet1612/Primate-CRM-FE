import './Cards.css';

function Cards(props){

    return(
        <div className='mainCard'>
            <h3>{props.title}</h3>
            <h4>{props.value}</h4>
        </div>
    )
}
export default Cards;
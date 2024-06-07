import PlayerContainer from "../components/PlayerContainer";
import RoundContainer from "../components/RoundContainer";

const Home = () => (
    <div class="flex-1 flex gap-8 flex-col">
        <PlayerContainer playerKey="Player1" />
        <PlayerContainer playerKey="Player2" />
        <RoundContainer />
    </div>
);

export default Home;

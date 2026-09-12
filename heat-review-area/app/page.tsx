import Map from "./components/google-maps/mapRendered";
import MapsInput from "./components/google-maps/mapsInput";


export default function Home(){
    

    return(
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-16 flex flex-col items-center text-center">
            <MapsInput />
            <Map/>
        </div>

    )


}
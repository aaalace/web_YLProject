import { connect } from "react-redux";
import { getRooms } from "../../store/Forum/selectors";
import { setRooms } from "../../store/Forum/actions";


const mapStateToProps = (state) => ({
    roomsConnect: getRooms(state),
})

const mapDispatchToProps = (dispatch) => ({
    setRoomsCon(data) {
        return dispatch(setRooms(data));
    },
})

export const ForumConnect = connect(mapStateToProps, mapDispatchToProps);
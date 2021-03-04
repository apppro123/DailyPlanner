import React from "react";
import { FlatList, FlatListProps, StyleSheet } from "react-native";

//own
import OwnView from "./View";
import OwnButton from "./Button";
import OwnIcon from "./Icon";

interface PropsI<T> extends FlatListProps<T> {
    maxHeight: number,
    defaultExpanded?: boolean,
    title: string
}

interface StateI {
    expanded: boolean
}

export class ExpandableListView<T> extends React.Component<PropsI<T>, StateI> {

    constructor(props: PropsI<T>) {
        super(props);
        const { defaultExpanded } = props;
        let expanded = true;
        if (defaultExpanded) {
            expanded = defaultExpanded;
        }
        this.state = {
            expanded
        }
    }

    switchExpandable = () => this.setState({ expanded: !this.state.expanded })


    render() {
        const { data, maxHeight, renderItem, title } = this.props;
        const { expanded } = this.state;
        return (
            <OwnView style={{ maxHeight: maxHeight, height: expanded ? undefined : 40, overflow: "hidden", width: "100%" }}>
                <OwnButton onPress={this.switchExpandable} style={styles.titleBarContainer} text={title} textStyle={styles.title}>
                    <OwnIcon iconSet="MaterialCommunity" name="chevron-down" size={40} />
                </OwnButton>
                <FlatList
                    data={data} renderItem={renderItem} />
            </OwnView>
        )
    }
}

const styles = StyleSheet.create({
    titleBarContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%"
    },
    title: {
        fontSize: 25
    }
})

export default ExpandableListView;
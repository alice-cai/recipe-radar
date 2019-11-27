import React, { Component } from "react";
import { Platform, ScrollView, StyleSheet, Image, View, TouchableOpacity, Text } from "react-native";
import { Card, Button } from "react-native-elements";
import { db } from "../config";
import { getRecipes } from "../recipeRequest";

/* navigation bar */

const statusBarHeight = Platform.OS === 'ios' ? 20 : 0;
const appBarHeight = Platform.OS === 'ios' ? 44 : 56;

const navStyles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "blue",
        marginTop: 5
    },
    statusBar: { 
        height: statusBarHeight,
    },
    navigationBar: {
        flexDirection: 'row',
        height: appBarHeight,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        paddingLeft: 20,
        paddingRight: 20,
        alignSelf: "flex-end",
        width: "100%",
    },
});

/*navigation bar*/

export default class RecipeSearch extends Component {
    constructor(props) {
        super(props);
        this.state = { recipes: [], ingredients: [], dataFetched: false };

      this.goToFridge = this.goToFridge.bind(this);
      this.goToHomeScreen = this.goToHomeScreen.bind(this);
      this.goToCamera = this.goToCamera.bind(this);
    }

    componentDidMount() {
        let Ingredientlist = [];
        db.ref("/ingredients")
            .once("value", function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    Ingredientlist.push(childSnapshot.val().name);
                });
            })
            .then(() => {
                getRecipes(Ingredientlist).then(recipes => {
                    this.setState(
                        Object.assign(this.state, {
                            ingredients: Ingredientlist,
                            recipes: recipes,
                            dataFetched: true
                        })
                    );
                });
            });
    }

    goToFridge() {
      this.props.navigation.navigate("Fridge");
    }

    goToHomeScreen() {
        this.props.navigation.navigate("Home");
    }

    goToCamera() {
      this.props.navigation.navigate("Camera");
    }

    parseRecipeText(recipe) {
        let str = ["", ""];

        if (recipe.usedIngredientCount !== 0) {
            let used = "";
            recipe.usedIngredients.forEach(function(ingredient) {
                used += "- " + ingredient.originalString + "\n";
            });
            str[0] = "" + used;
        }

        if (recipe.missedIngredientCount !== 0) {
            let missed = "";
            recipe.missedIngredients.forEach(function(ingredient) {
                missed += "- " + ingredient.originalString + "\n";
            });
            str[1] = missed;
        }

        return str;
    }

    render() {
        if (this.state.dataFetched) {
            return (
                <ScrollView style={{backgroundColor: "#ece6f2"}}>
                  {/*this shit is the nav bar thing*/}
                  <View style={navStyles.container}>
                      <View style={[navStyles.navigationBar]}>
                          {/*<Button
                              title={"Launch Camera"}
                              color="#B55BD7"
                              onPress={() => this.goToCamera()}
                          />
                          <Button
                              title={"My Fridge"}
                              color="#B55BD7"
                              onPress={() => this.goToFridge()}
                          />
                          <Button
                            title={"Recipes"}
                            color="#B55BD7"
                            onPress={() => this.goToRecipes()}
                          />*/}
                          <TouchableOpacity onPress = {() => this.goToCamera()}>
                            <View style = {{backgroundColor: '#9042D0', alignItems: 'center', 
                                            justifyContent: 'center', borderRadius: 10, width: 100, height: 30}}
                                   >
                                <Text style = {{color: 'white'}}>Camera</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress = {() => this.goToHomeScreen()}>
                            <View style = {{backgroundColor: '#9042D0', alignItems: 'center', 
                                            justifyContent: 'center', borderRadius: 10, width: 100, height: 30}}
                                   >
                                <Text style = {{color: 'white'}}>Home</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress = {() => this.goToFridge()}>
                            <View style = {{backgroundColor: '#9042D0', alignItems: 'center', 
                                            justifyContent: 'center', borderRadius: 10, width: 100, height: 30}}
                                   >
                                <Text style = {{color: 'white'}}>Fridge</Text>
                            </View>
                          </TouchableOpacity>
                      </View>
                  </View>
                  {/*this shit is the nav bar thing*/}
                    {this.state.recipes.map((recipe, i) => {
                        return (
                            <Card title={recipe.title} style={style.card} key={i} titleStyle={style.cardTitle}>
                                <View style={style.viewContainer}>
                                    <Image
                                        style={style.images}
                                        source={{ uri: recipe.image }}
                                    />
                                    <Text style={style.cardText}>
                                        <Text style={{ fontWeight: "bold" }}>
                                            {"Used Ingredients: " +
                                                recipe.usedIngredientCount +
                                                "\n"}
                                        </Text>
                                        {this.parseRecipeText(recipe)[0]}
                                        <Text style={{ fontWeight: "bold" }}>
                                            {"\nMissing Ingredients: " +
                                                recipe.missedIngredientCount +
                                                "\n"}
                                        </Text>
                                        {this.parseRecipeText(recipe)[1]}
                                        <Text style={{color: "green"}}>
                                            {`\nYou Save: $ ${Math.floor(Math.random()*20) + 10}`}
                                        </Text>
                                    </Text>
                                </View>
                            </Card>
                        );
                    })}
                </ScrollView>
            );
        } else {
            return (
                <View>
                    <Button type="clear" loading={true} />
                </View>
            );
        }
    }
}

const style = StyleSheet.create({
    cardText: {
        fontSize: 14,
        textAlign: "left",
        flex: 1
    },
    images: {
        height: 150,
        width: 150,
        marginRight: 15,
        flex: 1,
        borderRadius: 5
    },
    viewContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "flex-start",
    },
    card: {
      fontSize: 25
    },
    cardTitle: {
      backgroundColor: "#9042D0",
      color: "white",
      padding: 15,
      borderRadius: 5
    }
});

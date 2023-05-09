import { useNavigation } from "@react-navigation/native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

// Galio components
import { Block, Text, theme } from "galio-framework";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";
import Images from "../constants/Images";

import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useImmer } from "use-immer";
import { Button, Card } from "../components";
// Argon themed components
import { argonTheme, tabs, articles } from "../constants/";
import { formatDate } from "../utils/date";
import useUploadfournisseur from "../hooks/useUploadfournisseur";
import Base64 from "../utils/encode";

const htmlString = (data) => `
<html>
  <head>
    <meta charset="utf-8" />
    <title>DELIVER - MARCHAND</title>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0"
    />
  </head>
  <body>
  <p style="text-align: left; background-color:#000000;padding:10px;color:#FFFFFF">- DELIVER - ${formatDate(new Date())}</p>
  <h3 style="text-align:center;padding-bottom:20px;border-bottom:1px solid #000000">
  <img src="imgsource" alt="ALT" width="300" alt="ALT" border="0"></h3>
    <div class="section"></div>
      ${renderContent(data)}
  </body>
</html>
`;


const renderContent = (data) => {
  let string = ``;
  let fourni1 =  ``;
  let fourni2 = this.fourni2 ?? 'default value';


  data.forEach((item, i) => {

    string += `<div><h1>${item.title}</h1>`;
    string += `<div>`;
    item.parts.map((sub, j) => {
      string += `<h2 style="background-color:#073970;display:inline-block;padding:10px;color:#FFFFFF;margin-bottom:0px">${sub.title}</h2>`;
      string += `<div>`;
      sub.subParts.map((subItem, k) => {
        if (subItem.title) {
          string += `<h3 style="margin-bottom:0px">${subItem.title}</h3>`;
        }
        if (subItem.DELIVERvalue) {
          string += `<h3>${subItem.DELIVERvalue}:${fourni1}</h3>`;
        }
        if (subItem.DELIVERvalue2) {
          string += `<h3>${subItem.DELIVERvalue2}:${fourni2}</h3>`;
        }
        subItem.values.map((value, l) => {
          string += `<p style="padding-bottom:20px;border-bottom:1px solid #000000";color: ${value.color}">${value.label} ${
            value.value ? "☑️" : "☐️"
          }</p>`;
        });

      });
      string += `</div>`;
    });
    string += `</div>`;
    string += `</div>`;
  });
  return string, textInput;
};

const initialData = [
  {
    title: "DELIVER",
    parts: [

      {
        title: "1 - Number DELIVER",

        subParts: [
          {
            DELIVERvalue: "write",
            values: [

            ],

          },
          ],

      },
      {
        title: "2 - schedule",
        subParts: [
          {
            title: "- time",
            values: [
              { label: "Compliant", color: "green", value: false },
              { label: "Not Compliant", color: "red", value: false },
            ],
          },
        ],
      },

      {
        title: "3 - Conformité",
        subParts: [
          {
            title: "- Correspondance DELIVER au bon de commande",
            values: [
              { label: "Compliant", color: "green", value: false },
              { label: "Not Compliant", color: "red", value: false },
            ],
          },
        ],
      },


      {
        title: "4 - Quantity ",
        subParts: [
          {
            title: "desc",
            values: [
              { label: "Compliant", color: "green", value: false },
              { label: "Not Compliant", color: "red", value: false },
            ],
          },
        ],
      },

      {
        title: "5 - Quality ",
        subParts: [
          {
            title: "desc",
            values: [
              { label: "Compliant", color: "green", value: false },
              { label: "Not Compliant", color: "red", value: false },
            ],
          },
        ],
      },



      {
        title: "6 - Temp",
        subParts: [
          {
            title: "desc",
            DELIVERvalue2: "Temp",
            values: [


              { label: "Compliant", color: "green", value: false },
              { label: "Not Compliant", color: "red", value: false },
            ],
          },
        ],
      },
      {
        title: "7 - KKJ - JDHF ",
        subParts: [
          {
            title: "Desc»",
            values: [
              { label: "Compliant", color: "green", value: false },
              { label: "Not Compliant", color: "red", value: false },
            ],
          },
        ],
      },
      {
        title: "8 - Integrity :",
        subParts: [
          {
            title: "desc",
            values: [
              { label: "Compliant", color: "green", value: false },
              { label: "Not Compliant", color: "red", value: false },
            ],
          },
        ],
      },
      {
        title: "9 - Conditions :",
        subParts: [
          {
            title: "desc",
            values: [
              { label: "Compliant", color: "green", value: false },
              { label: "Not Compliant", color: "red", value: false },
            ],
          },
        ],
      },


    ],
  },
];

const DELIVERfournisseur1 = () => {
  const [data, setData] = useImmer(initialData);
  const navigation = useNavigation();

  const [text, onChangeText] = React.useState('Not filled');
   const [number, onChangeNumber] = React.useState(null);

  const { onUpload, isLoading } = useUploadfournisseur();

  const onPrint = async () => {
    const response = await Print.printToFileAsync({
      html: htmlString(data),
      height: 842,
      width: 595,
    });
    const suffix = `${formatDate(new Date())}-DELIVER-CLIENT`;
    const jsonName = `${suffix}.json`;
    const pdfName = `${suffix}.pdf`;
    const pdfPath = `${response.uri.slice(
      0,
      response.uri.lastIndexOf("/") + 1
    )}${pdfName}`;

    await FileSystem.moveAsync({
      from: response.uri,
      to: pdfPath,
    });
    try {
      const source = await FileSystem.readAsStringAsync(pdfPath, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const file = `data:application/pdf;base64,${source}`;
      await onUpload(file, suffix);
      const fileJSON = `data:application/json;base64,${Base64.encode(
        JSON.stringify(data)
      )}`;
      await onUpload(fileJSON, jsonName, true);
      findNegativeComment();
    } catch (e) {
      console.log(e);
    }
  };

  const findNegativeComment = () => {
    // concatenate title  and title subpart when color red and value is true
    const comments = data.reduce((acc, value) => {
      const comment = value.parts.reduce((acc2, value2) => {
        const comment2 = value2.subParts.reduce((acc3, value3) => {
          const comment3 = value3.values.reduce((acc4, value4) => {
            if (value4.value && value4.color === "red") {
              return `${value2.title} ${value3.title} ${value4.label} \n\n`;
            }
            return acc4;
          }, "");
          return `${acc3} ${comment3}`;
        }, "");
        return `${acc2} ${comment2}`;
      }, "");
      return `${acc} ${comment}`;
    }, "");
    const comments2 = comments.replace(/\s/g, "");
    console.log("comments2", comments2);
    if (comments2.length > 0) {
      Linking.openURL(
        `mailto:example@mail.com?subject=Alert-Company&body=${comments}+:\n\n`
      );
    }
  };

  const onFormClear = () => {
    setData(() => initialData);
  };
  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 0 }}>
    {<Text style={{ fontSize:20,backgroundColor:'#041c34',fontWeight:'normal',color:'#fff',padding:10,textAlign: "left" }}>{formatDate(new Date())}</Text>}

    <Block style={{ paddingHorizontal: 0 }} flex>
      <Image
      style={{ height: 200, width: 420, marginBottom:0, }}
      source={Images.Fournisseur1}

            />
      <Button onPress={onFormClear}style={styles.buttonclear
        }>
        <Text>Clear</Text>
  </Button>


        {data.map((item, i) => {
          return (
            <>
              <Text size={22} style={styles.title}>
                {item.title}
              </Text>
              {item.parts.map((sub, j) => {
                return (
                  <>
                    <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
                    <Text
                      size={18}
                      h3
                      style={{
                        fontFamily: "open-sans-regular",
                        marginTop:30,
                        padding:10,
                        backgroundColor:'#041c34',
                        fontWeight: 'bold',
                        textAlign:'center',
                        borderRadius:30,
                        marginBottom: theme.SIZES.BASE / 1,
                      }}
                      color={argonTheme.COLORS.WHITE}
                    >
                        {sub.title}
                      </Text>

                    </Block>
                    {sub.subParts.map((subItem, k) => {
                      return (
                        <>
                          {Boolean(subItem.title) && (
                            <Block
                              style={{ marginBottom:20,paddingHorizontal: theme.SIZES.BASE }}
                            >
                              <Text h4 size={18}>
                                {subItem.title}
                              </Text>
                            </Block>
                          )}

                          {Boolean(subItem.DELIVERvalue) && (
                            <Block
                              style={{ paddingHorizontal: theme.SIZES.BASE }}
                            >

                            <Text
                              size={18}
                              h3
                              style={{
                                fontFamily: "open-sans-regular",
                                marginTop:30,
                                fontWeight: 'bold',
                                marginBottom: theme.SIZES.BASE / 1,
                              }}
                              color={argonTheme.COLORS.DEFAULT}
                            >{subItem.DELIVERvalue}</Text>
                      <TextInput
                      style={{height: 40, width: 200, backgroundColor: 'white', color:'#595959', fontSize:20, margin: 10}}

                      onChangeText={(value) => { this.fourni1 = value;} }
                      />

                            </Block>
                          )}

                          {Boolean(subItem.DELIVERvalue2) && (
                            <Block
                              style={{ paddingHorizontal: theme.SIZES.BASE }}
                            >

                            <Text
                              size={18}
                              h3
                              style={{
                                fontFamily: "open-sans-regular",
                                marginTop:30,
                                fontWeight: 'bold',
                                marginBottom: theme.SIZES.BASE / 1,
                              }}
                              color={argonTheme.COLORS.DEFAULT}
                            >{subItem.DELIVERvalue2}</Text>
                      <TextInput
                      style={{height: 40, width: 200, backgroundColor: 'white', color:'#595959', fontSize:20, margin: 10}}
onChangeText={(value) => { this.fourni2 = value;} }
                      />

                            </Block>
                          )}

                          {subItem.values.map((value, l) => {
                            return (
                              <Block
                                row
                                middle
                                space="between"
                                style={{
                                  marginBottom: theme.SIZES.BASE,
                                  paddingHorizontal: theme.SIZES.BASE,
                                }}
                              >
                                <Text
                                  style={{ fontFamily: "open-sans-regular", textTransform:"uppercase", fontWeight:"bold",marginTop:20,marginBottom:20 }}
                                  size={18}
                                  color={argonTheme.COLORS.TEXT}
                                >
                                  {value.label}
                                </Text>

                                <BouncyCheckbox
                                  size={40}
                                  disableBuiltInState
                                  fillColor={value.color}
                                  unfillColor="#FFFFFF"
                                  iconStyle={{ borderColor: value.color }}
                                  textStyle={{
                                      fontFamily: "Roboto",
                                  }}
                                  isChecked={value.value}
                                  onPress={(isChecked) => {
                                    setData((draft) => {
                                      draft[i].parts[j].subParts[k].values.map(
                                        (v) => (v.value = false)
                                      );
                                      draft[i].parts[j].subParts[k].values[
                                        l
                                      ].value = !value.value;
                                    });
                                  }}
                                />
                              </Block>
                            );
                          })}

                        </>
                      );
                    })}

                  </>
                );
              })}
            </>
          );
        })}

        <Button loading={isLoading} title="print" onPress={onPrint}style={styles.buttonprint
          }>


          <Text
            style={{ fontFamily: "open-sans-regular" }}
            size={18}
            color={'#ffffff'}
            fontWeight={'bold'}
          >Generate</Text>
        </Button>
      </Block>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

buttonclear :{
backgroundColor:'white',
fontWeight: 'bold',
color:'#000000',
borderRadius:0,
textTransform:'uppercase',
padding:10,
marginBottom:20,
    },
    buttonphoto :{
  backgroundColor:'#4A919E',
  fontWeight: 'bold',
  color:'#ffffff',
  borderRadius:30,
  padding:10,
  marginBottom:20,
        },
        buttonprint :{
      backgroundColor:'#212E53',
      fontWeight: 'bold',
      color:'#fff',
      borderRadius:30,
      padding:10,
      marginTop:20,

      marginBottom:20,
            },
  title: {
    fontFamily: "open-sans-bold",
    paddingBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    marginTop: 44,
    color: argonTheme.COLORS.HEADER,
  },
  group: {
    paddingTop: theme.SIZES.BASE * 2,
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  button: {
    marginBottom: 40,
    marginTop: 80,
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
  },
  inputDefault: {
    borderBottomColor: argonTheme.COLORS.PLACEHOLDER,
  },
  inputTheme: {
    borderBottomColor: argonTheme.COLORS.PRIMARY,
  },
  inputTheme: {
    borderBottomColor: argonTheme.COLORS.PRIMARY,
  },
  inputInfo: {
    borderBottomColor: argonTheme.COLORS.INFO,
  },
  inputSuccess: {
    borderBottomColor: argonTheme.COLORS.SUCCESS,
  },
  inputWarning: {
    borderBottomColor: argonTheme.COLORS.WARNING,
  },
  inputDanger: {
    borderBottomColor: argonTheme.COLORS.ERROR,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center",
  },
});

export default DELIVERfournisseur1;

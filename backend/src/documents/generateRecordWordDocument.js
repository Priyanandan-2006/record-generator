import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType
} from "docx";
import { formatDisplayDate, normalizeText } from "../utils/recordData.js";

function createLabel(text) {
  return new Paragraph({
    spacing: {
      after: 80
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 20
      })
    ]
  });
}

function createValue(text) {
  return new Paragraph({
    spacing: {
      after: 40
    },
    children: [
      new TextRun({
        text: normalizeText(text) || "N/A",
        size: 22
      })
    ]
  });
}

function createMultilineParagraph(text, preserveWhitespace = false) {
  const lines = (normalizeText(text) || "N/A").split(/\r?\n/);

  return new Paragraph({
    spacing: {
      after: 160,
      line: 360
    },
    children: lines.flatMap((line, index) => {
      const run = new TextRun({
        text: line || " ",
        size: 22,
        font: preserveWhitespace ? "Courier New" : "Arial"
      });

      if (index === lines.length - 1) {
        return [run];
      }

      return [run, new TextRun({ break: 1 })];
    })
  });
}

function createSection(title, text, preserveWhitespace = false) {
  return [
    new Paragraph({
      spacing: {
        before: 240,
        after: 120
      },
      border: {
        top: {
          color: "DDC9AF",
          style: BorderStyle.SINGLE,
          size: 6
        },
        bottom: {
          color: "DDC9AF",
          style: BorderStyle.SINGLE,
          size: 6
        },
        left: {
          color: "DDC9AF",
          style: BorderStyle.SINGLE,
          size: 6
        },
        right: {
          color: "DDC9AF",
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      shading: {
        fill: "F4EADF"
      },
      children: [
        new TextRun({
          text: title,
          bold: true,
          color: "6F4E37",
          size: 24
        })
      ]
    }),
    createMultilineParagraph(text, preserveWhitespace)
  ];
}

export async function generateRecordWordDocument(data) {
  const document = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 180
            },
            children: [
              new TextRun({
                text: "Experiment Record",
                bold: true,
                color: "17324D",
                size: 32
              })
            ]
          }),
          new Paragraph({
            border: {
              bottom: {
                color: "CDB89D",
                style: BorderStyle.SINGLE,
                size: 6
              }
            },
            spacing: {
              after: 280
            }
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            layout: TableLayoutType.FIXED,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE
                    },
                    children: [
                      createLabel("Date"),
                      createValue(formatDisplayDate(data.date))
                    ]
                  }),
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE
                    },
                    children: [
                      createLabel("Experiment Number"),
                      createValue(data.experimentNumber)
                    ]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 2,
                    children: [
                      createLabel("Title"),
                      createValue(data.title)
                    ]
                  })
                ]
              })
            ]
          }),
          ...createSection("Aim", data.aim),
          ...createSection("Algorithm", data.algorithm),
          ...createSection("Code", data.code, true),
          ...createSection("Output", data.output),
          ...createSection("Result", data.result)
        ]
      }
    ]
  });

  return Packer.toBuffer(document);
}

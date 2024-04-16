import React from "react";
import {styled} from "styled-components";

const StyledTable = styled.table`
  border-spacing: 0px;
    
    td, tr{
      border-spacing: 0;
      border: 1px solid black;
    }
    input{
      border: none;
      outline: none;
    }
`
const Metrix = ({updateMatrixValue, temporalMatrix, time }) => {
    return (
        <StyledTable>
            <thead>
            <td/>
            <td>
                1
            </td>
            <td>
                2
            </td>
            <td>
                3
            </td>
            <td>
                4
            </td>
            <td>
                5
            </td>
            </thead>
            <tbody>
            {temporalMatrix[time].map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {
                        <td>
                            {rowIndex + 1}
                        </td>
                    }
                    {row.map((cell, colIndex) => (
                        <td key={colIndex}>
                            <input
                                type="number"
                                min="0" max="1" step="1"
                                value={cell}
                                onChange={(e) => updateMatrixValue(rowIndex, colIndex, e.target.value)}
                            />
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </StyledTable>
    )
}

export  default  Metrix
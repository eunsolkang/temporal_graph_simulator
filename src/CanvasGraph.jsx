import React, { useState, useEffect, useRef } from 'react';
import { temporalMatrixData } from './matrix';
import {CanvasContainer, Controller, Main} from './CanvasStyle'
import drawArrow from "./utils/drawArrow";
import Metrix from "./components/metrix";

const GraphCanvas = () => {
    const canvasRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [time, setTime] = useState(0);
    const [temporalMatrix, setTemporalMatrix] = useState(temporalMatrixData)
    const generateRandomNodes = () => {
        const newNodes = Array.from({ length: 5 }, () => ({
            x: Math.random() * (canvasRef.current.width - 20) + 10,
            y: Math.random() * (canvasRef.current.height - 20) + 10,
        }));
        setNodes(newNodes);
    };

    const handleSliderChange = (e) => {
        setTime(+e.target.value);
    };

    useEffect(() => {
        generateRandomNodes(); // 컴포넌트가 마운트될 때 노드의 위치를 한 번 설정합니다.
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const matrix = temporalMatrix[time]; 

        const drawGraph = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            if(nodes.length === 0){
                return;
            }
            // Draw edges
            matrix.forEach((row, i) => {
                row.forEach((cell, j) => {
                    if (cell === 1) {
                        drawArrow(ctx, nodes[i], nodes[j]); // 화살표 그리기
                    }
                });
            });

            // Draw nodes
            
            nodes.forEach((node, i) => {
                ctx.fillStyle = "black"
                ctx.beginPath();
                ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
                ctx.font = "bold 12px serif";
                ctx.fillText(i + 1, node.x - 2, node.y - 12)
                ctx.fill();
            });
        };

        drawGraph();
    }, [time, nodes, temporalMatrix]); // nodes를 의존성 배열에 추가하여 노드 위치가 변경될 때마다 그래프가 다시 그려지도록 합니다.


    const updateMatrixValue = (rowIndex, colIndex, value) => {
        const updatedMatrix = temporalMatrix.map((t,idx) => {
            if ( idx === time){
                return t.map((row, rIndex) =>
                    rIndex === rowIndex ? row.map((cell, cIndex) =>
                        cIndex === colIndex ? parseInt(value, 10) : cell
                    ) : row
                );
            }else{
                return t;
            }
        })
        console.log(updatedMatrix)
        setTemporalMatrix(updatedMatrix );
    };

    return (
        <Main>
            <Controller>
                <div>
                    <Metrix time={time} temporalMatrix={temporalMatrix} updateMatrixValue={updateMatrixValue}></Metrix>
                </div>
            </Controller>
            <CanvasContainer>
                <canvas ref={canvasRef} width="900" height="400" style={{ border: '1px solid #000' }} />
                <input
                    type="range"
                    min="0"
                    max={temporalMatrix.length - 1}
                    value={time}
                    onChange={handleSliderChange}
                />
                <h3>Time: {time}</h3>
                `           <input placeholder={'from'}/>
                `           <input placeholder={'to'}/>
            </CanvasContainer>

        </Main>
    );
};


export default GraphCanvas;
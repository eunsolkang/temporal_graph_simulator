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
    const [path, setPath] = useState([]);
    const [toNode, setToNode] = useState(null);
    const [fromNode, setFromNode] = useState(null);


    const generateRandomNodes = () => {
        const newNodes = Array.from({ length: 5 }, () => ({
            x: Math.random() * (canvasRef.current.width - 20) + 10,
            y: Math.random() * (canvasRef.current.height - 20) + 10,
        }));
        setNodes(newNodes);
    };
    const handleSliderChange = (e) => {
        setTime(+e.target.value);
        setPath([]);  // Clear path whenever time changes

    };

    const handleFromNodeChange = (e) => {
        setFromNode(e.target.value - 1);  // Adjust for zero indexing
    };

    const handleToNodeChange = (e) => {
        setToNode(e.target.value - 1);  // Adjust for zero indexing
    };


    useEffect(() => {
        generateRandomNodes(); // 컴포넌트가 마운트될 때 노드의 위치를 한 번 설정합니다.
    }, []);

    useEffect(() => {
        if (fromNode != null && toNode != null) {
            console.log(fromNode, toNode)
            bfsFindPath();
        }
    }, [fromNode, toNode, time]);

    const bfsFindPath = () => {
        const queue = [fromNode];
        const visited = new Array(nodes.length).fill(false);
        const predecessor = new Array(nodes.length).fill(-1);

        visited[fromNode] = true;

        while (queue.length > 0) {
            const current = queue.shift();
            if (current === toNode) {
                constructPath(predecessor, toNode);
                return;
            }

            temporalMatrix[time][current].forEach((exists, adjNode) => {
                if (exists === 1 && !visited[adjNode]) {
                    visited[adjNode] = true;
                    predecessor[adjNode] = current;
                    queue.push(adjNode);
                }
            });
        }

        setPath([]);  // No path found
    };

    const constructPath = (predecessor, node) => {
        const sequence = [];
        for (let at = node; at !== -1; at = predecessor[at]) {
            sequence.push(at);
        }
        sequence.reverse();
        setPath(sequence);
    };

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
                        const edgeColor = (path.includes(i) && path.includes(j) &&
                            path.indexOf(j) === path.indexOf(i) + 1) ? "red" : "black";
                        console.log(edgeColor)
                        drawArrow(ctx, nodes[i], nodes[j], edgeColor);  // Pass color dynamically
                    }
                });
            });

            // Draw nodes
            
            nodes.forEach((node, index) => {
                ctx.fillStyle = path.includes(index) ? "red" : "black";
                ctx.beginPath();
                ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
                ctx.font = "bold 12px serif";
                ctx.fillText(index + 1, node.x - 2, node.y - 12)
                ctx.fill();
            });
        };

        drawGraph();
    }, [time, nodes, temporalMatrix, path]); // nodes를 의존성 배열에 추가하여 노드 위치가 변경될 때마다 그래프가 다시 그려지도록 합니다.


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
        setTemporalMatrix(updatedMatrix);
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
                <input
                    placeholder={'from'}
                    onChange={handleFromNodeChange}
                    type="text"
                    min="1"
                    max="5"
                />
                <input
                    placeholder={'to'}
                    onChange={handleToNodeChange}
                    type="text"
                    min="1"
                    max="5"
                />
            </CanvasContainer>

        </Main>
    );
};


export default GraphCanvas;
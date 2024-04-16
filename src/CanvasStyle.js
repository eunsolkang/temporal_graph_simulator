import {styled} from 'styled-components';

export const Controller = styled.div`
    width: 250px;
    display: flex;
    flex-direction: column;
`

export const Main = styled.div`
    display: flex;
    flex-direction: row;
    canvas{
        flex: 1;
    }

`

export const CanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
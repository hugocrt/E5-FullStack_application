import styled from 'styled-components';

export const Loader = () => {
    return (
        <>
            <div className="container mt-5 d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
                <div className="col d-flex flex-column align-items-center">
                    <StyledWrapper>
                        <div className="spinner">
                            <div className="spinner1"/>
                        </div>
                    </StyledWrapper>
                    <h2 className="font-bold text-xl mt-3">
                        Loading...
                    </h2>
                </div>
            </div>
        </>
    );
}

const StyledWrapper = styled.div`
    .spinner {
        background-image: linear-gradient(rgb(186, 66, 255) 35%, rgb(0, 225, 255));
        width: 100px;
        height: 100px;
        animation: spinning82341 1.7s linear infinite;
        text-align: center;
        border-radius: 50%;
        filter: blur(1px);
        box-shadow: 0 -5px 20px 0 rgb(186, 66, 255), 0 5px 20px 0 rgb(0, 225, 255);
    }

    .spinner1 {
        background-color: white;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        filter: blur(10px);
    }

    @keyframes spinning82341 {
        to {
            transform: rotate(360deg);
        }
    }
`;
// Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="footer bg-primary-subtle text-body-tertiary pt-2 mt-2 pb-1">
            <div className="container text-center">
                <div className="row align-items-center">
                    <div className="col">
                        <img src="/ESIEE_Paris_BLANC.png" alt="Logo ESIEE PARIS" width='30%' height='30%'/>
                    </div>
                    <div className="col text-center">
                        <small>
                            &copy; {new Date().getFullYear()} Created by Hugo Carangeot and Titouan Conte-Devolx, supervised by Mr. Daniel and Morgan Courivaud.
                        </small>
                    </div>
                    <div className="col">
                        <div className="text-center">
                            <ul className="list-unstyled list-inline">
                                <li className="list-inline-item">
                                    <a className="text-white btn btn-floating btn-sm" href="https://github.com/hugocrt/E5-FullStack_application" style={{fontSize: '30px'}}>
                                        <i className="bi bi-github"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a className="text-white btn btn-floating btn-sm" href="mailto:hugo.carangeot@edu.esiee.fr" style={{fontSize: '30px'}}>
                                        <i className="bi bi-envelope-at-fill"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );
};

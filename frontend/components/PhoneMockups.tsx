export function WillowPhoneMockup() {
    return (
        <div className="phoneMockup willowPhone" aria-label="Willow iOS preview">
            <div className="phoneStatus">
                <span>8:00</span>
                <span>||| wifi</span>
            </div>
            <div className="phoneBrand">Willow</div>
            <h2>Stop typing. Start talking.</h2>
            <div className="pagerDots">
                <span />
                <span />
                <span />
                <span />
            </div>
            <button>Get started</button>
            <p>
                Already have an account? <strong>Sign In</strong>
            </p>
            <div className="homeIndicator" />
        </div>
    );
}

export function ImagePhoneMockup({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="phoneMockup imagePhone" aria-label={alt}>
            <img src={src} alt={alt} />
            <div className="phoneStatus">
                <span>8:00</span>
                <span>|||</span>
            </div>
            <div className="homeIndicator" />
        </div>
    );
}

export function PinkLoginMockup() {
    return (
        <div className="pinkLoginMockup" aria-label="TikTok login preview">
            <div className="loginPanel">
                <div className="musicMark">d</div>
                <h2>Welcome back</h2>
                <div className="accountPill">
                    <span />
                    <div>
                        <strong>little_corgi</strong>
                        <small>Google login</small>
                    </div>
                </div>
                <button>Log in</button>
                <p>Log into another account</p>
            </div>
        </div>
    );
}

export function TiktokPhoneMockup() {
    return (
        <div className="phoneMockup tiktokPhone" aria-label="TikTok product preview">
            <div className="phoneStatus">
                <span>8:00</span>
                <span>|||</span>
            </div>
            <div className="scheduleRows">
                <div>
                    <span>17:00</span>
                    <strong>Arsenal</strong>
                    <em>24</em>
                </div>
                <div>
                    <span>12:00</span>
                    <strong>Paris Saint Germain</strong>
                    <button>Add</button>
                </div>
                <button className="fullSchedule">Full schedule</button>
            </div>
            <p className="accountsLabel">Accounts on TikTok</p>
            <div className="accountRow">
                <span>UEFA</span>
                <span>Barcelo...</span>
                <span>Name</span>
            </div>
            <p className="accountsLabel">Videos</p>
            <div className="videoTiles">
                <img src="/assets/home/llFQDYX8hVGGWR0KzQMwRTLPbSk.png" alt="" />
                <img src="/assets/home/YY47usy9IwbiBHqoSvv0xMDaSo.png" alt="" />
            </div>
            <div className="homeIndicator" />
        </div>
    );
}

<defs>
    <pattern
        id="scuff-workspace-bg-pattern"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
    >
        <rect width="100%" height="100%" class="scuff-workspace-bg-main" />
        <circle cx="1" cy="1" r="1" class="scuff-workspace-bg-dots" />
    </pattern>

    <filter
        id="scuff-input-highlight"
        height="160%"
        width="180%"
        y="-30%"
        x="-40%"
        ><feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        <feComponentTransfer result="outBlur">
            <feFuncA
                type="table"
                tableValues="0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1"
            />
        </feComponentTransfer>
        <feFlood flood-color="#FFFFFF" flood-opacity="1" result="outColor" />
        <feComposite
            in="outColor"
            in2="outBlur"
            operator="in"
            result="outGlow"
        />
        <feComposite in="SourceGraphic" in2="outGlow" operator="over" />
    </filter>

    <symbol id="scuff-block-green-flag" viewBox="0 0 24 24">
        <path
            fill="#45993d"
            d="M20.8,3.7c-0.4-0.2-0.9-0.1-1.2,0.2c-2,1.6-4.8,1.6-6.8,0c-2.3-1.9-5.6-2.3-8.3-1V2.5c0-0.6-0.5-1-1-1s-1,0.4-1,1v18.8c0,0.5,0.5,1,1,1h0.1c0.5,0,1-0.5,1-1v-6.4c1-0.7,2.1-1.2,3.4-1.3c1.2,0,2.4,0.4,3.4,1.2c2.9,2.3,7,2.3,9.8,0c0.3-0.2,0.4-0.5,0.4-0.9V4.7C21.6,4.2,21.3,3.8,20.8,3.7z M20.5,13.9C20.5,13.9,20.5,13.9,20.5,13.9C18,16,14.4,16,11.9,14c-1.1-0.9-2.5-1.4-4-1.4c-1.2,0.1-2.3,0.5-3.4,1.1V4C7,2.6,10,2.9,12.2,4.6c2.4,1.9,5.7,1.9,8.1,0c0.1,0,0.1,0,0.2,0c0,0,0.1,0.1,0.1,0.1L20.5,13.9z"
        />
        <path
            fill="#4cbf56"
            d="M20.6,4.8l-0.1,9.1c0,0,0,0.1,0,0.1c-2.5,2-6.1,2-8.6,0c-1.1-0.9-2.5-1.4-4-1.4c-1.2,0.1-2.3,0.5-3.4,1.1V4C7,2.6,10,2.9,12.2,4.6c2.4,1.9,5.7,1.9,8.1,0c0.1,0,0.1,0,0.2,0C20.5,4.7,20.6,4.7,20.6,4.8z"
        />
    </symbol>

    <symbol id="scuff-block-dropdown-arrow" viewBox="0 0 12.71 8.79">
        <g opacity="0.1">
            <path
                fill="#231f20"
                d="M12.71,2.44A2.41,2.41,0,0,1,12,4.16L8.08,8.08a2.45,2.45,0,0,1-3.45,0L0.72,4.16A2.42,2.42,0,0,1,0,2.44,2.48,2.48,0,0,1,.71.71C1,0.47,1.43,0,6.36,0S11.75,0.46,12,.71A2.44,2.44,0,0,1,12.71,2.44Z"
            />
        </g>
        <path
            fill="#fff"
            d="M6.36,7.79a1.43,1.43,0,0,1-1-.42L1.42,3.45a1.44,1.44,0,0,1,0-2c0.56-.56,9.31-0.56,9.87,0a1.44,1.44,0,0,1,0,2L7.37,7.37A1.43,1.43,0,0,1,6.36,7.79Z"
        />
    </symbol>

    <symbol id="scuff-block-tick" viewBox="0 0 512 457.57">
        <path
            style="fill-rule:evenodd;"
            class="cls-1"
            d="M0,220.57c100.43-1.33,121-5.2,191.79,81.5,54.29-90,114.62-167.9,179.92-235.86C436-.72,436.5-.89,512,.24,383.54,143,278.71,295.74,194.87,457.57,150,361.45,87.33,280.53,0,220.57Z"
        />
    </symbol>
</defs>

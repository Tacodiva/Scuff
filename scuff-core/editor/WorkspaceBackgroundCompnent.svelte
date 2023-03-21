<filter id="scuff-input-highlight" height="160%" width="180%" y="-30%" x="-40%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
    <feComponentTransfer result="outBlur">
        <feFuncA type="table" tableValues="0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1" />
    </feComponentTransfer>
    <feFlood flood-color="#FFFFFF" flood-opacity="1" result="outColor" />
    <feComposite in="outColor" in2="outBlur" operator="in" result="outGlow" />
    <feComposite in="SourceGraphic" in2="outGlow" operator="over" />
</filter>

<pattern width="40" height="40" patternUnits="userSpaceOnUse" class="scuff-workspace-background">
    <rect width="100%" height="100%" class="scuff-workspace-bg-main" />
    <circle cx="1" cy="1" r="1" class="scuff-workspace-bg-dots" />
</pattern>
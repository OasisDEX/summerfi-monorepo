import { RiskRatio } from "../src/common/implementation/RiskRatio";
import { Percentage } from "../src/common/implementation/Percentage";

describe("RiskRatio", () => {
    describe("RiskRatio", () => {
        describe("creates risk ratio from ltv", () => {
            it("should have correct ltv value", () => {
                const riskRatio = RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: 80 }), type: RiskRatio.type.LTV });

                expect(riskRatio.ltv.toString()).toEqual("80");
            });
        });

        describe("converts risk ratio to different types", () => {
            it("should convert to CollateralizationRatio type correctly", () => {
                const riskRatio = RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: 80 }), type: RiskRatio.type.LTV });

                expect(riskRatio.toType(RiskRatio.type.CollateralizationRatio)).toEqual("125");
            });

            it("should convert to Multiple type correctly", () => {
                const riskRatio = RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: 80 }), type: RiskRatio.type.LTV });

                expect(riskRatio.toType(RiskRatio.type.Multiple)).toEqual("5");
            });
        });
    });

    it("creates risk ratio from collateralization ratio", () => {
        const riskRatio = RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: 130 }), type: RiskRatio.type.CollateralizationRatio });

        expect(riskRatio.toType(RiskRatio.type.LTV)).toEqual("76.92307692307692");
    });

    it("creates risk ratio from multiple", () => {
        const riskRatio = RiskRatio.createFrom({ ratio: Percentage.createFrom({ percentage: 4.5 }), type: RiskRatio.type.Multiple });

        expect(riskRatio.toType(RiskRatio.type.LTV)).toEqual("77.77777777777779");
    });
});
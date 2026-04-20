from typing import Dict, Optional


class CalculatorService:
    def __init__(self):
        self.paper_prices = {
            "standard": 0.05,
            "glossy": 0.08,
            "matte": 0.07,
            "cardstock": 0.12
        }
        
        self.color_multipliers = {
            "bw": 1.0,
            "color": 1.5,
            "full_color": 2.0
        }
        
        self.finishing_prices = {
            "none": 0,
            "lamination": 0.5,
            "binding": 2.0,
            "folding": 0.3,
            "cutting": 0.2,
            "perforation": 0.4
        }

    def calculate_base_price(
        self,
        quantity: int,
        paper_type: str = "standard",
        color_mode: str = "bw",
        finishing: Optional[str] = None
    ) -> Dict[str, float]:
        paper_price = self.paper_prices.get(paper_type, 0.05)
        color_multiplier = self.color_multipliers.get(color_mode, 1.0)
        finishing_price = self.finishing_prices.get(finishing, 0) if finishing else 0
        
        base_unit_price = paper_price * color_multiplier
        
        if quantity >= 1000:
            discount = 0.15
        elif quantity >= 500:
            discount = 0.10
        elif quantity >= 100:
            discount = 0.05
        else:
            discount = 0
        
        discounted_unit_price = base_unit_price * (1 - discount)
        unit_price_with_finishing = discounted_unit_price + finishing_price
        total_price = unit_price_with_finishing * quantity
        
        return {
            "unit_price": round(unit_price_with_finishing, 2),
            "total_price": round(total_price, 2),
            "discount_applied": discount,
            "breakdown": {
                "paper_cost": round(paper_price * quantity, 2),
                "color_cost": round((paper_price * color_multiplier - paper_price) * quantity, 2),
                "finishing_cost": round(finishing_price * quantity, 2),
                "discount_amount": round(base_unit_price * discount * quantity, 2)
            }
        }

    def calculate_custom_order(
        self,
        quantity: int,
        width: float,
        height: float,
        paper_type: str = "standard",
        color_mode: str = "bw",
        finishing: Optional[str] = None
    ) -> Dict[str, float]:
        area = (width * height) / 10000
        
        base_calculation = self.calculate_base_price(quantity, paper_type, color_mode, finishing)
        
        area_multiplier = 1 + (area - 1) * 0.5 if area > 1 else area
        
        adjusted_unit_price = base_calculation["unit_price"] * area_multiplier
        adjusted_total_price = adjusted_unit_price * quantity
        
        return {
            "unit_price": round(adjusted_unit_price, 2),
            "total_price": round(adjusted_total_price, 2),
            "area_sqm": round(area, 4),
            "discount_applied": base_calculation["discount_applied"],
            "breakdown": base_calculation["breakdown"]
        }
